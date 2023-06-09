from flask import Flask, request,jsonify, send_file,render_template
from psycopg2 import connect, extras

app = Flask(__name__)
#key = Fernet.generate_key()



#host = 'localhost'
#database = 'cus10'
#username = 'postgres'
#password = '1234'
#port = 5432

host = '137.184.120.127'
database = 'sigcon'
username = 'modulo4'   
password = 'modulo4'
port = 5432

def get_db_connection():
    conn = connect(host=host, database=database, user=username, password=password, port=port)
    return conn

@app.get('/api/recaudacion')
def get_recaudaciones():

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("SELECT * FROM recaudacion")
    recaudaciones = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(recaudaciones)


@app.post('/api/recaudacion')
def create_recaudacion():
    new_recaudacion = request.get_json()
    id_transaccion = new_recaudacion['id_transaccion'] 
    id_cuenta = new_recaudacion['id_cuenta']
    id_mant_recibo = new_recaudacion['id_mant_recibo']
    n_operacion = new_recaudacion['n_operacion']
    fecha_operacion = new_recaudacion['fecha_operacion']
    moneda = new_recaudacion['moneda']
    importe = new_recaudacion ['importe']
    id_recaudacion_estado = new_recaudacion ['id_recaudacion_estado']
    id_cuenta_predio = new_recaudacion ['id_cuenta_predio']
    observacion = new_recaudacion ['observacion']

    conn=get_db_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("INSERT INTO recaudacion (id_transaccion ,id_cuenta,id_mant_recibo,n_operacion,fecha_operacion,moneda, importe,id_recaudacion_estado,id_cuenta_predio,observacion) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *",
                (id_transaccion, id_cuenta, id_mant_recibo, n_operacion,fecha_operacion, moneda,importe, id_recaudacion_estado, id_cuenta_predio, observacion))
    new_created_recaudacion = cur.fetchone()
    print(new_created_recaudacion)
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new_created_recaudacion)

@app.get('/api/recaudacion/<id_transaccion>')
def get_recaudacion(id_transaccion):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("SELECT * FROM recaudacion WHERE id_transaccion = %s", (id_transaccion,))
    recaudacion = cur.fetchone()
    cur.close()
    conn.close()

    if recaudacion is None:
        return jsonify({'message': 'Recaudacion no encontrada'}), 404

    return jsonify(recaudacion)

@app.put('/api/recaudacion/<id_transaccion>')
def update_recaudacion(id_transaccion):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    new_recaudacion = request.get_json()
    #id_transaccion = new_recaudacion['id_transaccion'] 
    id_cuenta = new_recaudacion['id_cuenta']
    id_mant_recibo = new_recaudacion['id_mant_recibo']
    n_operacion = new_recaudacion['n_operacion']
    fecha_operacion = new_recaudacion['fecha_operacion']
    moneda = new_recaudacion['moneda']
    importe = new_recaudacion ['importe']
    id_recaudacion_estado = new_recaudacion ['id_recaudacion_estado']
    id_cuenta_predio = new_recaudacion ['id_cuenta_predio']
    observacion = new_recaudacion ['observacion']

    cur.execute("UPDATE recaudacion SET id_cuenta = %s, id_mant_recibo = %s, n_operacion = %s, fecha_operacion = %s , moneda = %s , importe = %s , id_recaudacion_estado = %s , id_cuenta_predio = %s, observacion = %s WHERE id_transaccion = %s RETURNING *",
                ( id_cuenta, id_mant_recibo, n_operacion,fecha_operacion, moneda,importe, id_recaudacion_estado, id_cuenta_predio, observacion,id_transaccion))
    updated_recaudacion = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if updated_recaudacion is None:
        return jsonify({'message': 'Recaudacion no encontrada'}), 404
    return jsonify(updated_recaudacion)


@app.delete('/api/recaudacion/<id_transaccion>')
def delete_recaudacion(id_transaccion):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute("DELETE FROM recaudacion WHERE id_transaccion = %s RETURNING *", (id_transaccion,))
    recaudacion = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if recaudacion is None:
        return jsonify({'message': 'Recaudacion no encontrada'}), 404
    return jsonify(recaudacion)

@app.get('/')
def home():
    return render_template('index.html')
    # render_template('login.html')
    
if __name__ == '__main__':
    app.run(debug=True)