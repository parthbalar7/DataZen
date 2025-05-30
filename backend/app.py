import os
from flask import Flask, request, jsonify # type: ignore
from sklearn.cluster import KMeans # type: ignore
from sklearn.preprocessing import StandardScaler # type: ignore
from flask_cors import CORS # type: ignore
import pandas as pd # type: ignore
from flask_bcrypt import Bcrypt # type: ignore
from flask_jwt_extended import ( # type: ignore
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

try:
    from fbprophet import Prophet # type: ignore
except ImportError:
    from prophet import Prophet # type: ignore

from sklearn.cluster import KMeans # type: ignore
from sklearn.preprocessing import StandardScaler # type: ignore

app = Flask(__name__) 
CORS(app)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)


users = {}

ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


latest_inventory_data = []

def generate_text_summary(insights_dict):
    summary_parts = []

    if 'best_seller' in insights_dict:
        summary_parts.append(f"{insights_dict['best_seller']}")
    
    if 'low_category' in insights_dict:
        summary_parts.append(f"{insights_dict['low_category']}")
    
    if 'seasonal_trend' in insights_dict:
        summary_parts.append(f"{insights_dict['seasonal_trend']}")
    
    if 'least_trend' in insights_dict:
        summary_parts.append(f"{insights_dict['least_trend']}")
    
    if 'sales_drop_alert' in insights_dict:
        summary_parts.append(f"{insights_dict['sales_drop_alert']}")
    
    if 'inventory_alert' in insights_dict:
        summary_parts.append(f"{insights_dict['inventory_alert']}")
    elif 'critical_inventory' in insights_dict:
        summary_parts.append(f"{insights_dict['critical_inventory']}")
    
    if 'loyal_customer' in insights_dict:
        summary_parts.append(f"{insights_dict['loyal_customer']}")
    
    if 'promotion' in insights_dict:
        summary_parts.append(f"{insights_dict['promotion']}")

    summary = " ".join(summary_parts)
    if not summary.strip():
        summary = "No major highlights identified from the data."

    return summary


@app.route('/')
def home():
    return jsonify({"message": "Welcome to DataZen Flask API with Auth, Date Filters, Forecast & Inventory Alerts!"})


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password required"}), 400
    
    username = data['username'].strip().lower()
    password = data['password']

    if username in users:
        return jsonify({"error": "Username already taken"}), 400
    
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    users[username] = {"password_hash": password_hash}
    return jsonify({"message": f"User '{username}' registered successfully."}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password required"}), 400
    
    username = data['username'].strip().lower()
    password = data['password']

    user = users.get(username)
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401
    
    if not bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({"error": "Invalid username or password"}), 401
    
    access_token = create_access_token(identity=username)
    return jsonify({"message": "Login successful", "token": access_token}), 200



@app.route('/api/inventory', methods=['GET'])
@jwt_required()
def get_inventory():
    """
    Returns the inventory from the last uploaded CSV 
    (grouped by Product, summing up InventoryQuantity).
    """
    return jsonify(latest_inventory_data), 200


@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    """
    Handle CSV upload + optional date filters.
    Return charts, insights, forecast, segmentation, and auto-summary.
    Also updates global 'latest_inventory_data' from the CSV's inventory info.
    """
    global latest_inventory_data

    current_user = get_jwt_identity()

    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Only CSV files are allowed'}), 400

    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({'error': f'Failed to read CSV: {str(e)}'}), 400

    df.dropna(how='all', inplace=True)
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        df.dropna(subset=['Date'], inplace=True)

    start_date_str = request.form.get('startDate', None)
    end_date_str = request.form.get('endDate', None)

    if start_date_str:
        try:
            start_date = pd.to_datetime(start_date_str)
            df = df[df['Date'] >= start_date]
        except:
            pass

    if end_date_str:
        try:
            end_date = pd.to_datetime(end_date_str)
            df = df[df['Date'] <= end_date]
        except:
            pass

    if df.empty:
        latest_inventory_data = []  
        return jsonify({
            "charts": {}, 
            "insights": {}, 
            "forecast": {}, 
            "customer_segmentation": {}, 
            "auto_summary": ""
        }), 200


    charts_data = {}

    # 1) Sales Over Time
    sales_over_time_data = {}
    if 'Sales' in df.columns and 'Date' in df.columns:
        sales_by_date = df.groupby('Date')['Sales'].sum().reset_index()
        sales_over_time_data = {
            "dates": sales_by_date['Date'].dt.strftime('%Y-%m-%d').tolist(),
            "sales": sales_by_date['Sales'].tolist()
        }
    charts_data['sales_over_time'] = sales_over_time_data

    # 2) Sales by Product
    sales_by_product = {}
    if 'Sales' in df.columns and 'Product' in df.columns:
        prod_group = df.groupby('Product')['Sales'].sum().reset_index().sort_values('Sales', ascending=False)
        sales_by_product = {
            "products": prod_group['Product'].tolist(),
            "sales": prod_group['Sales'].tolist()
        }
    charts_data['sales_by_product'] = sales_by_product

    # 3) Category vs Region (Stacked Bar)
    category_region_data = {}
    if all(col in df.columns for col in ['Sales','Category','Region']):
        cat_reg_group = df.groupby(['Category', 'Region'])['Sales'].sum().reset_index()
        pivot_data = cat_reg_group.pivot(index='Category', columns='Region', values='Sales').fillna(0)
        category_region_data = {
            "categories": pivot_data.index.tolist(),
            "series": [
                {"region": c, "sales": pivot_data[c].tolist()}
                for c in pivot_data.columns
            ]
        }
    charts_data['category_region'] = category_region_data

    # 4) Share of Sales (Pie)
    sales_share_data = {}
    if all(col in df.columns for col in ['Sales','Category']):
        cat_group = df.groupby('Category')['Sales'].sum().reset_index()
        sales_share_data = {
            "labels": cat_group['Category'].tolist(),
            "values": cat_group['Sales'].tolist()
        }
    charts_data['sales_share'] = sales_share_data

    # 5) Scatter: Sales vs Inventory
    scatter_data = {}
    if all(col in df.columns for col in ['Sales','InventoryQuantity']):
        scatter_data = {
            "sales": df['Sales'].tolist(),
            "inventory": df['InventoryQuantity'].tolist()
        }
    charts_data['sales_vs_inventory'] = scatter_data

    # 6) Combo: Sales & Inventory Over Time
    combo_data = {}
    if all(col in df.columns for col in ['Sales','InventoryQuantity','Date']):
        daily_sales = df.groupby('Date')['Sales'].sum().reset_index()
        daily_inv = df.groupby('Date')['InventoryQuantity'].sum().reset_index()
        merged = pd.merge(daily_sales, daily_inv, on='Date', how='outer').fillna(0)
        merged.sort_values('Date', inplace=True)
        combo_data = {
            "dates": merged['Date'].dt.strftime('%Y-%m-%d').tolist(),
            "sales": merged['Sales'].tolist(),
            "inventory": merged['InventoryQuantity'].tolist()
        }
    charts_data['sales_inventory_combo'] = combo_data

    # 7) Heat Map: Category vs Region
    heatmap_data = {}
    if all(col in df.columns for col in ['Sales','Category','Region']):
        cat_reg_group = df.groupby(['Category', 'Region'])['Sales'].sum().reset_index()
        pivot_data = cat_reg_group.pivot(index='Category', columns='Region', values='Sales').fillna(0)
        heatmap_data = {
            "categories": pivot_data.index.tolist(),
            "regions": pivot_data.columns.tolist(),
            "matrix": pivot_data.values.tolist()
        }
    charts_data['category_region_heatmap'] = heatmap_data

    # 8) Waterfall Chart
    waterfall_data = {}
    if all(col in df.columns for col in ['Sales','Date']):
        df['Quarter'] = df['Date'].dt.to_period('Q')
        quarter_group = df.groupby('Quarter')['Sales'].sum().reset_index()
        if len(quarter_group) > 0:
            quarters = quarter_group['Quarter'].astype(str).tolist()
            values = []
            prev = 0
            for val in quarter_group['Sales']:
                if not values:
                    values.append(val)
                    prev = val
                else:
                    diff = val - prev
                    values.append(diff)
                    prev = val
            waterfall_data = {
                "quarters": quarters,
                "values": values
            }
    charts_data['sales_waterfall'] = waterfall_data

    # 9) Treemap
    treemap_data = {"labels": [], "parents": [], "values": []}
    if all(col in df.columns for col in ['Sales','Category','Product']):
        cat_prod_sales = df.groupby(['Category','Product'])['Sales'].sum().reset_index()
        for _, row in cat_prod_sales.iterrows():
            treemap_data["labels"].append(row['Product'])
            treemap_data["parents"].append(row['Category'])
            treemap_data["values"].append(row['Sales'])
        # also add category-level nodes
        cat_sales = df.groupby('Category')['Sales'].sum().reset_index()
        for _, row in cat_sales.iterrows():
            treemap_data["labels"].append(row['Category'])
            treemap_data["parents"].append("")
            treemap_data["values"].append(row['Sales'])
    charts_data['sales_treemap'] = treemap_data

    # ----------------- INSIGHTS -----------------
    insights = {}
    if 'Sales' in df.columns and not df.empty:
        if 'Product' in df.columns:
            product_sales = df.groupby('Product')['Sales'].sum()
            if not product_sales.empty:
                best_product = product_sales.idxmax()
                best_val = product_sales.max()
                insights['best_seller'] = f"Best-selling product: {best_product} with sales: ${best_val:.2f}"
                if 'InventoryQuantity' in df.columns:
                    avg_inv_best = df[df['Product'] == best_product]['InventoryQuantity'].mean()
                    if avg_inv_best < 50:
                        insights['inventory_alert'] = (
                            f"Inventory Alert: {best_product} has low avg inventory ({avg_inv_best:.1f} units)."
                        )

        if 'Category' in df.columns:
            cat_sales = df.groupby('Category')['Sales'].sum()
            if not cat_sales.empty:
                low_cat = cat_sales.idxmin()
                low_val = cat_sales.min()
                insights['low_category'] = f"Underperforming category: {low_cat} with sales: ${low_val:.2f}"

        if 'Date' in df.columns:
            df['Month'] = df['Date'].dt.month_name()
            month_sales = df.groupby('Month')['Sales'].sum().sort_values(ascending=False)
            if not month_sales.empty:
                peak_month = month_sales.index[0]
                peak_val = month_sales.iloc[0]
                insights['seasonal_trend'] = (
                    f"Seasonal Trend: Peak sales in {peak_month} with total sales: ${peak_val:.2f}"
                )

            if not month_sales.empty:
                least_month = month_sales.index[-1]
                least_val = month_sales.iloc[-1]
                insights['least_trend'] = (
                    f"Seasonal Trend: Least sales in {least_month} with total sales: ${least_val:.2f}"
                )

        insights['promotion'] = (
            "Promotional Recommendation: Focus on promoting top-selling products and consider discounts for underperforming categories."
        )

        if 'CustomerID' in df.columns:
            cust_counts = df['CustomerID'].value_counts()
            if not cust_counts.empty:
                top_cust = cust_counts.idxmax()
                if cust_counts.max() >= 5:
                    insights['loyal_customer'] = (
                        f"Customer Loyalty: {top_cust} has placed {cust_counts.max()} orders. Consider loyalty rewards."
                    )

        if 'InventoryQuantity' in df.columns and 'Product' in df.columns:
            avg_inventory = df.groupby('Product')['InventoryQuantity'].mean()
            critically_low = avg_inventory[avg_inventory < 10]
            if not critically_low.empty:
                prod_list = ", ".join(critically_low.index)
                insights['critical_inventory'] = (
                    f"Critically low (<10 units) average inventory for: {prod_list}. Restock soon!"
                )

        if 'Date' in df.columns:
            df_sorted = df.sort_values('Date')
            monthly = df_sorted.groupby(pd.Grouper(key='Date', freq='M'))['Sales'].sum().reset_index()
            if len(monthly) > 1:
                last_two = monthly.tail(2)
                prev_sales = last_two.iloc[0]['Sales']
                curr_sales = last_two.iloc[1]['Sales']
                if prev_sales > 0 and (curr_sales < 0.7 * prev_sales):
                    insights['sales_drop_alert'] = (
                        f"Sales dropped by more than 30% from {last_two.iloc[0]['Date'].strftime('%B %Y')} "
                        f"to {last_two.iloc[1]['Date'].strftime('%B %Y')}. Consider a discount campaign!"
                    )

  
    forecast_data = {}
    if all(col in df.columns for col in ['Sales','Date']) and not df.empty:
        daily_sales = df.groupby('Date')['Sales'].sum().reset_index()
        daily_sales = daily_sales.rename(columns={'Date': 'ds','Sales': 'y'})
        daily_sales.sort_values('ds', inplace=True)

        if len(daily_sales) > 5:
            try:
                model = Prophet()
                model.fit(daily_sales)
                future = model.make_future_dataframe(periods=180)
                forecast = model.predict(future)
                fc = forecast[['ds','yhat']].tail(180)
                forecast_data = {
                    "dates": fc['ds'].dt.strftime('%Y-%m-%d').tolist(),
                    "predictions": fc['yhat'].round(2).tolist()
                }
            except Exception as ex:
                forecast_data['error'] = f"Forecast failed: {str(ex)}"

  
    segmentation_data = {}
    if {'CustomerID', 'Sales', 'Date'} <= set(df.columns):

   
        latest_date = df['Date'].max()
        rfm_df = df.groupby('CustomerID').agg({
            'Date': lambda x: (latest_date - x.max()).days,  # Recency
            'CustomerID': 'count',                           # Frequency
            'Sales': 'sum'                                   # Monetary
        }).rename(columns={'Date': 'Recency',
                           'CustomerID': 'Frequency',
                           'Sales': 'Monetary'})

     
        scaler = StandardScaler()
        rfm_scaled = scaler.fit_transform(rfm_df)
        k = 4
        kmeans = KMeans(n_clusters=k, random_state=42)
        rfm_df['Cluster'] = kmeans.fit_predict(rfm_scaled)

        cluster_counts = rfm_df['Cluster'].value_counts().to_dict()

  
        inv_centers = scaler.inverse_transform(kmeans.cluster_centers_)
        insight_lines = []
        for idx, (r, f, m) in enumerate(inv_centers):
            insight_lines.append(
                f"Cluster {idx}: avg recency ≈ {r:.0f} days, "
                f"frequency ≈ {f:.1f} orders, monetary ≈ ${m:.0f}"
            )

      
        top10 = rfm_df.sort_values('Frequency', ascending=False)\
                      .head(10).reset_index()

        segmentation_data = {
            'rfm_scatter': {               
                'recency':   rfm_df['Recency'].tolist(),
                'monetary':  rfm_df['Monetary'].tolist(),
                'frequency': rfm_df['Frequency'].tolist(),
                'cluster':   rfm_df['Cluster'].tolist(),
            },
            'cluster_sizes':  cluster_counts,
            'cluster_insights': insight_lines,
            'fm_table': top10.to_dict(orient='records')  
        }


    if 'Product' in df.columns and 'InventoryQuantity' in df.columns:
        inv_df = df.groupby('Product')['InventoryQuantity'].sum().reset_index()
       
        latest_inventory_data = inv_df.to_dict(orient='records')
    else:
        
        latest_inventory_data = []

 
    auto_summary = generate_text_summary(insights)

    result = {
        "charts": charts_data,
        "insights": insights,
        "forecast": forecast_data,
        "customer_segmentation": segmentation_data,
        "auto_summary": auto_summary
    }
    return jsonify(result), 200


if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=8008)
