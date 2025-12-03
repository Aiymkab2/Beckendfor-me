from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Service, Part, Master
from accounts.models import Profile


class Command(BaseCommand):
    help = 'Загружает начальные данные в базу'

    def handle(self, *args, **options):
        self.stdout.write('Начинаем загрузку данных...')

        # Создаем админа
        admin_user, created = User.objects.get_or_create(
            username='admin123',
            defaults={
                'email': 'admin@autoservice.kz',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Админ создан: admin123 / admin123'))
        else:
            self.stdout.write('Админ уже существует')

        # Обновляем профиль для админа
        profile, created = Profile.objects.get_or_create(
            user=admin_user,
            defaults={
                'full_name': 'Администратор',
                'phone': '+77001234567',
                'car_info': 'Администратор системы'
            }
        )
        if not created:
            profile.full_name = 'Администратор'
            profile.phone = '+77001234567'
            profile.car_info = 'Администратор системы'
            profile.save()

        # Создаем обычных пользователей
        users_data = [
            {'username': 'user1', 'email': 'user1@test.kz', 'full_name': 'Айдар Нурланов', 'phone': '+77011234567', 'car_info': 'Toyota Camry 2018'},
            {'username': 'user2', 'email': 'user2@test.kz', 'full_name': 'Мария Сейтова', 'phone': '+77021234567', 'car_info': 'Mercedes-Benz C200 2020'},
            {'username': 'user3', 'email': 'user3@test.kz', 'full_name': 'Данияр Абдулов', 'phone': '+77031234567', 'car_info': 'BMW X5 2019'},
            {'username': 'user4', 'email': 'user4@test.kz', 'full_name': 'Айгуль Касымова', 'phone': '+77041234567', 'car_info': 'Lexus RX350 2021'},
            {'username': 'user5', 'email': 'user5@test.kz', 'full_name': 'Ерлан Беков', 'phone': '+77051234567', 'car_info': 'Audi A6 2020'},
        ]

        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={'email': user_data['email']}
            )
            if created:
                user.set_password('password123')
                user.save()
            
            # Обновляем или создаем профиль
            profile, profile_created = Profile.objects.get_or_create(
                user=user,
                defaults={
                    'full_name': user_data['full_name'],
                    'phone': user_data['phone'],
                    'car_info': user_data['car_info']
                }
            )
            if not profile_created:
                profile.full_name = user_data['full_name']
                profile.phone = user_data['phone']
                profile.car_info = user_data['car_info']
                profile.save()
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Пользователь создан: {user_data["username"]}'))
            else:
                self.stdout.write(f'Пользователь {user_data["username"]} уже существует')

        # Создаем услуги
        services_data = [
            {'title': 'Замена масла', 'description': 'Полная замена моторного масла и масляного фильтра. Используем только качественные масла премиум-класса.', 'duration_minutes': 30, 'price_kzt': 8000, 'category': 'Техобслуживание'},
            {'title': 'Диагностика двигателя', 'description': 'Комплексная диагностика двигателя с использованием современного оборудования. Включает компьютерную диагностику и визуальный осмотр.', 'duration_minutes': 60, 'price_kzt': 5000, 'category': 'Диагностика'},
            {'title': 'Шиномонтаж', 'description': 'Демонтаж, монтаж и балансировка колес. Работаем с любыми типами шин и дисков.', 'duration_minutes': 45, 'price_kzt': 3500, 'category': 'Шины'},
            {'title': 'Замена колодок', 'description': 'Замена передних и задних тормозных колодок. Проверка тормозных дисков и жидкости.', 'duration_minutes': 90, 'price_kzt': 25000, 'category': 'Тормозная система'},
            {'title': 'Балансировка колес', 'description': 'Точная балансировка всех четырех колес на современном оборудовании.', 'duration_minutes': 40, 'price_kzt': 4000, 'category': 'Шины'},
            {'title': 'Замена свечей зажигания', 'description': 'Замена комплекта свечей зажигания. Проверка катушек зажигания.', 'duration_minutes': 45, 'price_kzt': 12000, 'category': 'Двигатель'},
            {'title': 'Замена воздушного фильтра', 'description': 'Замена воздушного фильтра двигателя. Очистка корпуса фильтра.', 'duration_minutes': 20, 'price_kzt': 3000, 'category': 'Техобслуживание'},
            {'title': 'Замена ремня ГРМ', 'description': 'Замена ремня газораспределительного механизма и натяжных роликов. Гарантия качества.', 'duration_minutes': 180, 'price_kzt': 45000, 'category': 'Двигатель'},
            {'title': 'Промывка системы охлаждения', 'description': 'Полная промывка системы охлаждения и замена антифриза. Проверка термостата и радиатора.', 'duration_minutes': 60, 'price_kzt': 15000, 'category': 'Система охлаждения'},
            {'title': 'Регулировка фар', 'description': 'Проверка и точная регулировка света фар согласно ГОСТ. Проверка всех ламп.', 'duration_minutes': 30, 'price_kzt': 5000, 'category': 'Электрика'},
            {'title': 'Замена тормозной жидкости', 'description': 'Полная замена тормозной жидкости с прокачкой системы. Проверка герметичности.', 'duration_minutes': 45, 'price_kzt': 8000, 'category': 'Тормозная система'},
            {'title': 'Ремонт кондиционера', 'description': 'Диагностика, заправка и ремонт системы кондиционирования. Очистка радиатора.', 'duration_minutes': 90, 'price_kzt': 20000, 'category': 'Кондиционер'},
            {'title': 'Замена генератора', 'description': 'Снятие, диагностика и установка генератора. Проверка ремня и натяжителя.', 'duration_minutes': 120, 'price_kzt': 35000, 'category': 'Электрика'},
            {'title': 'Замена стартера', 'description': 'Снятие, ремонт или замена стартера. Проверка аккумулятора и проводки.', 'duration_minutes': 90, 'price_kzt': 28000, 'category': 'Электрика'},
            {'title': 'Покраска кузова', 'description': 'Локальная покраска элементов кузова. Подбор цвета и полировка.', 'duration_minutes': 240, 'price_kzt': 60000, 'category': 'Кузовной ремонт'},
            {'title': 'Рихтовка кузова', 'description': 'Восстановление геометрии кузова после ДТП. Работа на стапеле.', 'duration_minutes': 300, 'price_kzt': 80000, 'category': 'Кузовной ремонт'},
            {'title': 'Замена амортизаторов', 'description': 'Замена передних и задних амортизаторов. Проверка стоек и пружин.', 'duration_minutes': 150, 'price_kzt': 55000, 'category': 'Подвеска'},
            {'title': 'Развал-схождение', 'description': 'Регулировка углов установки колес на современном стенде. Гарантия точности.', 'duration_minutes': 60, 'price_kzt': 12000, 'category': 'Подвеска'},
            {'title': 'Замена сцепления', 'description': 'Замена диска сцепления, корзины и выжимного подшипника. Проверка маховика.', 'duration_minutes': 180, 'price_kzt': 65000, 'category': 'Трансмиссия'},
            {'title': 'Замена масла в АКПП', 'description': 'Полная замена масла в автоматической коробке передач с фильтром.', 'duration_minutes': 90, 'price_kzt': 25000, 'category': 'Трансмиссия'},
        ]

        for service_data in services_data:
            service, created = Service.objects.get_or_create(
                title=service_data['title'],
                defaults=service_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Услуга создана: {service_data["title"]}'))
            else:
                self.stdout.write(f'Услуга {service_data["title"]} уже существует')

        # Создаем запчасти
        parts_data = [
            {'sku': 'OIL-001', 'title': 'Моторное масло 5W-30 4л', 'description': 'Синтетическое моторное масло премиум-класса. Подходит для большинства современных двигателей.', 'price_kzt': 12000, 'stock_quantity': 50, 'supplier': 'Castrol'},
            {'sku': 'OIL-002', 'title': 'Моторное масло 0W-20 4л', 'description': 'Синтетическое моторное масло для современных двигателей. Низкая вязкость для лучшей экономии топлива.', 'price_kzt': 14000, 'stock_quantity': 40, 'supplier': 'Mobil'},
            {'sku': 'OIL-003', 'title': 'Моторное масло 10W-40 4л', 'description': 'Полусинтетическое моторное масло. Универсальное решение для большинства автомобилей.', 'price_kzt': 10000, 'stock_quantity': 45, 'supplier': 'Shell'},
            {'sku': 'FILT-001', 'title': 'Масляный фильтр', 'description': 'Оригинальный масляный фильтр высокого качества. Обеспечивает отличную фильтрацию.', 'price_kzt': 3500, 'stock_quantity': 100, 'supplier': 'Mann Filter'},
            {'sku': 'FILT-002', 'title': 'Топливный фильтр', 'description': 'Топливный фильтр для бензиновых и дизельных двигателей. Защищает систему впрыска.', 'price_kzt': 4500, 'stock_quantity': 60, 'supplier': 'Mann Filter'},
            {'sku': 'FILT-003', 'title': 'Салонный фильтр', 'description': 'Фильтр салона с активированным углем. Очищает воздух в салоне автомобиля.', 'price_kzt': 5500, 'stock_quantity': 70, 'supplier': 'Mahle'},
            {'sku': 'BRAKE-001', 'title': 'Тормозные колодки передние', 'description': 'Комплект передних тормозных колодок премиум-класса. Отличное торможение и долгий срок службы.', 'price_kzt': 18000, 'stock_quantity': 30, 'supplier': 'Brembo'},
            {'sku': 'BRAKE-002', 'title': 'Тормозные колодки задние', 'description': 'Комплект задних тормозных колодок. Высокое качество и надежность.', 'price_kzt': 15000, 'stock_quantity': 30, 'supplier': 'Brembo'},
            {'sku': 'BRAKE-003', 'title': 'Тормозной диск передний', 'description': 'Вентилируемый тормозной диск передний. Обеспечивает эффективное охлаждение.', 'price_kzt': 30000, 'stock_quantity': 20, 'supplier': 'Brembo'},
            {'sku': 'BRAKE-004', 'title': 'Тормозной диск задний', 'description': 'Тормозной диск задний. Высокое качество материалов и обработки.', 'price_kzt': 28000, 'stock_quantity': 20, 'supplier': 'Brembo'},
            {'sku': 'BRAKE-005', 'title': 'Тормозная жидкость DOT-4', 'description': 'Тормозная жидкость DOT-4 1л. Высокая температура кипения и отличные характеристики.', 'price_kzt': 3500, 'stock_quantity': 80, 'supplier': 'ATE'},
            {'sku': 'SPARK-001', 'title': 'Свечи зажигания (комплект)', 'description': 'Комплект из 4 свечей зажигания иридиевых. Долгий срок службы и стабильная работа.', 'price_kzt': 8000, 'stock_quantity': 40, 'supplier': 'NGK'},
            {'sku': 'SPARK-002', 'title': 'Свечи зажигания платиновые', 'description': 'Комплект платиновых свечей зажигания. Премиум качество для современных двигателей.', 'price_kzt': 12000, 'stock_quantity': 35, 'supplier': 'Denso'},
            {'sku': 'AIR-001', 'title': 'Воздушный фильтр', 'description': 'Воздушный фильтр двигателя. Обеспечивает чистый воздух для двигателя.', 'price_kzt': 2500, 'stock_quantity': 80, 'supplier': 'Mahle'},
            {'sku': 'COOL-001', 'title': 'Антифриз 5л', 'description': 'Охлаждающая жидкость антифриз концентрат. Защита от замерзания до -40°C.', 'price_kzt': 6000, 'stock_quantity': 60, 'supplier': 'Mobil'},
            {'sku': 'COOL-002', 'title': 'Помпа водяная', 'description': 'Водяной насос системы охлаждения. Оригинальное качество, надежная работа.', 'price_kzt': 20000, 'stock_quantity': 10, 'supplier': 'Gates'},
            {'sku': 'COOL-003', 'title': 'Термостат', 'description': 'Термостат системы охлаждения. Точное поддержание рабочей температуры двигателя.', 'price_kzt': 8000, 'stock_quantity': 25, 'supplier': 'Wahler'},
            {'sku': 'BELT-001', 'title': 'Ремень ГРМ', 'description': 'Ремень газораспределительного механизма. Критически важная запчасть для двигателя.', 'price_kzt': 25000, 'stock_quantity': 20, 'supplier': 'Gates'},
            {'sku': 'BELT-002', 'title': 'Ремень генератора', 'description': 'Ремень привода генератора, кондиционера и насоса ГУР. Высокая прочность.', 'price_kzt': 8000, 'stock_quantity': 30, 'supplier': 'Gates'},
            {'sku': 'BELT-003', 'title': 'Ролик натяжителя', 'description': 'Ролик натяжителя ремня ГРМ. Обеспечивает правильное натяжение ремня.', 'price_kzt': 12000, 'stock_quantity': 15, 'supplier': 'INA'},
            {'sku': 'BATTERY-001', 'title': 'Аккумулятор 60Ah', 'description': 'Автомобильный аккумулятор 60Ah. Необслуживаемый, с гарантией 2 года.', 'price_kzt': 35000, 'stock_quantity': 15, 'supplier': 'Varta'},
            {'sku': 'BATTERY-002', 'title': 'Аккумулятор 75Ah', 'description': 'Мощный аккумулятор 75Ah для автомобилей с большим энергопотреблением.', 'price_kzt': 42000, 'stock_quantity': 12, 'supplier': 'Varta'},
            {'sku': 'TIRE-001', 'title': 'Шина 205/55 R16', 'description': 'Летняя шина премиум-класса. Отличное сцепление и комфорт на дороге.', 'price_kzt': 28000, 'stock_quantity': 25, 'supplier': 'Michelin'},
            {'sku': 'TIRE-002', 'title': 'Шина 225/45 R17', 'description': 'Спортивная летняя шина. Высокая управляемость и отличные характеристики.', 'price_kzt': 32000, 'stock_quantity': 20, 'supplier': 'Bridgestone'},
            {'sku': 'TIRE-003', 'title': 'Зимняя шина 205/55 R16', 'description': 'Зимняя шина с шипами. Отличное сцепление на снегу и льду.', 'price_kzt': 35000, 'stock_quantity': 18, 'supplier': 'Nokian'},
            {'sku': 'TIRE-004', 'title': 'Всесезонная шина 215/60 R16', 'description': 'Универсальная всесезонная шина. Подходит для круглогодичного использования.', 'price_kzt': 30000, 'stock_quantity': 22, 'supplier': 'Continental'},
            {'sku': 'WIPER-001', 'title': 'Дворники (комплект)', 'description': 'Комплект щеток стеклоочистителя премиум-класса. Тихая работа и отличная очистка.', 'price_kzt': 5000, 'stock_quantity': 50, 'supplier': 'Bosch'},
            {'sku': 'BULB-001', 'title': 'Лампочка H7', 'description': 'Галогенная лампа H7 55W. Яркий белый свет, долгий срок службы.', 'price_kzt': 2000, 'stock_quantity': 100, 'supplier': 'Osram'},
            {'sku': 'BULB-002', 'title': 'Лампочка H4', 'description': 'Галогенная лампа H4 60/55W. Дальний и ближний свет в одной лампе.', 'price_kzt': 1800, 'stock_quantity': 90, 'supplier': 'Osram'},
            {'sku': 'BULB-003', 'title': 'LED лампа H7', 'description': 'Светодиодная лампа H7. Яркий белый свет, низкое энергопотребление, долгий срок службы.', 'price_kzt': 8000, 'stock_quantity': 40, 'supplier': 'Philips'},
            {'sku': 'SUSP-001', 'title': 'Амортизатор передний', 'description': 'Амортизатор передний газонаполненный. Обеспечивает комфорт и управляемость.', 'price_kzt': 25000, 'stock_quantity': 12, 'supplier': 'Monroe'},
            {'sku': 'SUSP-002', 'title': 'Амортизатор задний', 'description': 'Амортизатор задний. Восстанавливает комфорт и безопасность движения.', 'price_kzt': 22000, 'stock_quantity': 12, 'supplier': 'Monroe'},
            {'sku': 'SUSP-003', 'title': 'Стойка стабилизатора', 'description': 'Стойка стабилизатора поперечной устойчивости. Восстанавливает управляемость.', 'price_kzt': 6000, 'stock_quantity': 30, 'supplier': 'Lemforder'},
            {'sku': 'EXHAUST-001', 'title': 'Глушитель', 'description': 'Глушитель выхлопной системы. Оригинальное качество, тихая работа.', 'price_kzt': 45000, 'stock_quantity': 8, 'supplier': 'Bosal'},
            {'sku': 'EXHAUST-002', 'title': 'Резонатор', 'description': 'Резонатор выхлопной системы. Снижает шум и вибрации.', 'price_kzt': 18000, 'stock_quantity': 10, 'supplier': 'Bosal'},
            {'sku': 'FUEL-001', 'title': 'Топливный насос', 'description': 'Топливный насос электрический. Обеспечивает стабильную подачу топлива.', 'price_kzt': 35000, 'stock_quantity': 8, 'supplier': 'Bosch'},
            {'sku': 'FUEL-002', 'title': 'Форсунка инжектора', 'description': 'Топливная форсунка для системы впрыска. Точная дозировка топлива.', 'price_kzt': 12000, 'stock_quantity': 15, 'supplier': 'Bosch'},
            {'sku': 'ELEC-001', 'title': 'Генератор', 'description': 'Генератор автомобильный. Обеспечивает зарядку аккумулятора и питание электрооборудования.', 'price_kzt': 55000, 'stock_quantity': 5, 'supplier': 'Bosch'},
            {'sku': 'ELEC-002', 'title': 'Стартер', 'description': 'Стартер автомобильный. Надежный запуск двигателя в любых условиях.', 'price_kzt': 45000, 'stock_quantity': 6, 'supplier': 'Bosch'},
            {'sku': 'ELEC-003', 'title': 'Катушка зажигания', 'description': 'Катушка зажигания. Обеспечивает высокое напряжение для свечей зажигания.', 'price_kzt': 15000, 'stock_quantity': 20, 'supplier': 'Bosch'},
        ]

        for part_data in parts_data:
            part, created = Part.objects.get_or_create(
                sku=part_data['sku'],
                defaults=part_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Запчасть создана: {part_data["title"]}'))
            else:
                self.stdout.write(f'Запчасть {part_data["sku"]} уже существует')

        # Создаем мастеров
        masters_data = [
            {'name': 'Асхат Касымов', 'specialization': 'Двигатель, диагностика', 'phone': '+77012345678'},
            {'name': 'Ерлан Токтаров', 'specialization': 'Тормозная система', 'phone': '+77022345678'},
            {'name': 'Данияр Абдулов', 'specialization': 'Шиномонтаж, балансировка', 'phone': '+77032345678'},
            {'name': 'Айдар Нурланов', 'specialization': 'Электрика, кондиционер', 'phone': '+77042345678'},
        ]

        for master_data in masters_data:
            master, created = Master.objects.get_or_create(
                name=master_data['name'],
                defaults=master_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Мастер создан: {master_data["name"]}'))
            else:
                self.stdout.write(f'Мастер {master_data["name"]} уже существует')

        self.stdout.write(self.style.SUCCESS('\nВсе данные успешно загружены!'))

