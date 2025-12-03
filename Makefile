.PHONY: help migrate seed run build docker-up docker-down

help:
	@echo "Доступные команды:"
	@echo "  make migrate    - Выполнить миграции"
	@echo "  make seed      - Загрузить начальные данные"
	@echo "  make run       - Запустить Django сервер"
	@echo "  make docker-up - Запустить через Docker"
	@echo "  make docker-down - Остановить Docker контейнеры"

migrate:
	python manage.py migrate

seed:
	python manage.py seed_data

run:
	python manage.py runserver

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

