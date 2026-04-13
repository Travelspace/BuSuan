import pyodbc
import json

mdb_path = r'd:\Work\AI_cs\test\BuSuan\ZiDian.mdb'
conn_str = r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=' + mdb_path

try:
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    
    tables = [table.table_name for table in cursor.tables(tableType='TABLE')]
    print(f"Tables: {tables}")
    
    all_data = {}
    for table_name in tables:
        cursor.execute(f'SELECT * FROM [{table_name}]')
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        print(f"Table '{table_name}': {len(columns)} columns, {len(rows)} rows")
        print(f"Columns: {columns}")
        if rows:
            print(f"First row: {rows[0]}")
        
        table_data = []
        for row in rows:
            row_dict = {}
            for i, col in enumerate(columns):
                val = row[i]
                if isinstance(val, bytes):
                    try:
                        val = val.decode('gbk')
                    except:
                        val = val.decode('utf-8', errors='replace')
                row_dict[col] = val
            table_data.append(row_dict)
        all_data[table_name] = table_data
    
    with open(r'd:\Work\AI_cs\test\BuSuan\zidian_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    print(f"\nSaved to zidian_data.json")
    
    conn.close()
except Exception as e:
    print(f"Error: {e}")
