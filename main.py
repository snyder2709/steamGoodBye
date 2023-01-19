from flask import (
    Flask, 
    request, 
    redirect, 
    render_template,
    jsonify,
    flash, 
    )
from flask_login import LoginManager, login_user, current_user, login_required
from flask_apscheduler import APScheduler
from werkzeug.security import check_password_hash
from userlogin import UserLogin
from services import Connecting
import os


app = Flask(__name__)
app.secret_key = os.urandom(50)
conn: Connecting = Connecting()
login_manager = LoginManager(app)
scheduler = APScheduler()

conn.connect_db()
conn.create_tables()
conn.create_superuser('genitalgrinder90@gmail.com' ,'Brick92', 'root')


@login_manager.user_loader

@app.route('/', methods=['GET', 'POST'])
def head():
    return render_template('head-page.html')

@app.route('/faq', methods=['GET', 'POST'])
def faq():
    redirect('/')
    return render_template('f.a.q.html')
# @app.route('/auth', methods=['GET', 'POST'])
# def auth():
#     # redirect('/')
#     return render_template('authorize.html')

def load_user(id):
    print('load_user')
    return UserLogin().fromDB(id)

@app.route('/', methods=['GET', 'POST'])
def main():
    if request.method == 'POST':
        form = request.get_json()
        login = form.get('login')
        password = form.get('password')
        data = conn.check_user(login)
        if not data:
            return jsonify({"message" : "Данный логин не зарегистрирован"})
        elif login == data[0][1] and check_password_hash(data[0][3], password) == False:
            return jsonify({"message" : "неправильный пароль"})
        elif login == data[0][2] and check_password_hash(data[0][3], password) == True:
            userlogin = UserLogin().create(data[0])
            login_user(userlogin)
            user_id = current_user.get_id()
            token = conn.generate_token()
            conn.autorization(user_id, token)
            is_admin = conn.check_admin(login)
            # scheduler.add_job(id = 'Scheduled Task', func=conn.need, trigger="interval", seconds=20, kwargs=conn.clear_token(user_id))
            # scheduler.start()
            if is_admin:
                flash(user_id)
                flash(token)
                return redirect('/admin')
            flash(user_id)
            flash(token)
            return redirect('/shop')
    return jsonify({"message" : "autorization"})

@app.route('/reg', methods=['GET', 'POST'])
def reg():
    print(request)
    if request.method == 'POST':
        form = request.get_json()
        print(form)
        email = form.get('email')
        login = form.get('login')
        password = form.get('password')
        data = conn.check_user(login)
        mail_data = conn.check_user_mail(email)
        if data:
            return jsonify({"message" : "логин занят"})
        elif mail_data:
            return jsonify({"message" : "Данный адрес уже зарегистрирован"})
        elif not data and not mail_data and password:
            conn.registration(email, login, password)
            return redirect('/')
    return jsonify({"message" : "registration"})

@app.route('/shop')
def search():
    data = conn.get_games()
    return jsonify(data)

@app.route('/shop/<int:game_id>', methods=['GET', 'POST'])
def get_game(game_id):
    data = conn.list_result()
    basket_data = conn.check_add_in_basket(id)
    result: list[tuple] = []
    for i in data:
        if i[0] == int(game_id):
            price = i[5]
            result.append(i)
    if request.method == 'POST':
        form = request.get_json()
        user_id = form.get('user_id')
        data = conn.check_buy(id)
        if not data:
            return jsonify({"message" : "извините ключей не осталось"})
        elif data:
            if not basket_data:
                conn.add_to_basket(user_id, game_id)
                return jsonify(result, {"message" : "добавлено в корзину"})
            else:
                return jsonify(result, {"message" : "товар уже добавлен"})
    return jsonify(result)

@app.route('/shop/basket', methods=['GET', 'POST'])
def basket():
    summ = 0
    data = conn.check_basket()
    if request.method == 'POST':
        form = request.get_json()
        user_id = form.get('user_id')
        games = form.getlist('id_game')
        for i in games:
            price: float = conn.get_price(i)
            summ += price[0]
        print(summ)
        user_money = conn.check_money(user_id)
        if user_money[0] < summ:
            return jsonify(data, {"message" : "У вас недостаточно средств"})
        for j in games:
            key = conn.get_key(j)
            conn.key_send(key[0])
            conn.add_game_to_user(user_id, j, key[1])
        conn.buy(summ, user_id)
        return jsonify(data, {"message" : "Поздравляем с приобретением!"})
    return jsonify(data, {"message" : "basket"})

@app.route('/personal-cab/<int:id>', methods=['GET','POST'])
def personal_cab(id):
    personal_data = conn.get_user(id)
    games_data = conn.get_user_games(id)
    if request.method == 'POST':
        form = request.get_json()
        user_id = form.get('user_id')
        money = form.get('money')
        add_friend = form.get('add_friend')
        try:
            if int(money) > 0:
                conn.art_money(user_id, money)
                return jsonify(personal_data, games_data, user_id, {"message" : "success"})
        except:
            search = conn.search_friend(add_friend)
            if search:
                message = 'Найден пользователь'
                return jsonify(personal_data, games_data, message, search)
            message = 'Пользователь не найден'
            return jsonify(personal_data, games_data, message)
    return jsonify(personal_data, games_data)

@app.route('/admin')
def admin():
    return jsonify({"message" : "тут надо отловить 2 флеша и сделать ссылки на\
         добавления, жанров, игр и кодов"})

@app.route('/admin/ok/set-genres', methods=['GET', 'POST'])
def add_genre():
    data = conn.get_genres()
    if request.method == 'POST':
        form = request.get_json()
        title = form.get('title')
        if title:
            conn.set_genres(title)
            return jsonify(data, {"message" : "Genre was added"})
        return jsonify(data, {"message" : "Fields must be not empty"})
    return jsonify(data)

@app.route('/admin/ok/add-key', methods=['GET', 'POST'])
def add_key():
    result = conn.list_result()
    data = conn.get_games()
    if request.method == 'POST':
        form = request.get_json()
        key = form.get('key')
        game = form.get('game')
        code_data = conn.check_key(key)
        if len(key) != 25:
            return jsonify(result, data, {"message" : "Длина ключа должна быть 25 символов"})
        elif not game:
            return jsonify(result, data, {"message" : "Игра не выбрана"})
        elif code_data:
            return jsonify(result, data, {"message" : "Ключ уже добавлен"})
        elif len(key) == 25 and data:
            conn.add_key(game, key)
            return jsonify(result, data, {"message" : "Ключ добавлен"})
    return jsonify(result, data)

@app.route('/admin/add-game', methods=['GET', 'POST'])
def add_game():
    genre_data = conn.get_genres()
    games_data = conn.get_games()
    result = conn.list_result()
    if request.method == 'POST':
        form = request.get_json()
        title = form.get('title')
        description = form.get('description')
        price = form.get('price')
        year = request.form.get('year')
        genres = form.getlist('genre')
        if title and description and genres and title not in games_data:
            conn.set_game(title, description, year, price)
            game = conn.get_game_id(title)
            game_id = game[0][0]
            for i in genres:
                conn.res(game_id, i)
            return jsonify(genre_data, result, {"message" : "Game added!"})
        elif not title or not description or not genres or title in games_data:
            return jsonify(genre_data, result, {"message" : "fields must not be empty"})
    return jsonify(genre_data, result)


if __name__ == '__main__':
    app.run(port=1234, debug=True)