import React, { useState, useEffect } from 'react';

export default function PrivacyPolicy() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  // Проверяем, было ли уже принято соглашение
  useEffect(() => {
    const privacyAccepted = localStorage.getItem('privacyAccepted');
    if (!privacyAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacyAccepted', 'true');
    localStorage.setItem('privacyAcceptDate', new Date().toISOString());
    setIsVisible(false);
    setIsClosed(true);
  };

  // Если согласие уже дано или окно закрыто - не показываем ничего
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl border border-gray-200">
        
        {/* Заголовок */}
        <div className="bg-green-600 text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold text-center">🔒 Ваша конфиденциальность</h1>
          <p className="text-center mt-2 text-green-100">
            Прежде чем начать использование калькулятора
          </p>
        </div>

        {/* Контент */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4 text-sm leading-relaxed">
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Политика конфиденциальности</h2>
              <p className="text-gray-600 mb-2">
                <strong>Дата последнего обновления:</strong> 25 сентября 2025 г.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">1. Общие положения</h3>
              <p className="text-gray-600">
                Сайт <strong>paceRUN</strong> — это калькулятор темпа бега, который не требует регистрации 
                и не собирает ваши персональные данные.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">2. Что мы НЕ собираем</h3>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                <li>Имена, email-адреса, телефоны</li>
                <li>Пароли или банковские данные</li>
                <li>Любые персональные идентификаторы</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">3. Яндекс.Метрика</h3>
              <p className="text-gray-600">
                Мы используем <strong>Яндекс.Метрику</strong> для анализа трафика. Собираются только 
                <strong> обезличенные данные</strong>:
              </p>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-gray-600">
                <li>Источники трафика (поиск, соцсети)</li>
                <li>Тип браузера и устройства</li>
                <li>Время посещения страниц</li>
              </ul>
              <p className="text-gray-600 mt-2">
                Эти данные не позволяют идентифицировать личность и используются только для статистики.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">4. Согласие</h3>
              <p className="text-gray-600">
                Продолжая использование сайта, вы соглашаетесь с обработкой обезличенных данных.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">5. Контакты</h3>
              <p className="text-gray-600">
                Вопросы по конфиденциальности: <strong>avsipko@gmail.com</strong>
              </p>
            </section>
          </div>
        </div>

        {/* Кнопка принятия */}
        <div className="p-6 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <button
            onClick={handleAccept}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            ✅ Я ОЗНАКОМЛЕН И ПРИНИМАЮ УСЛОВИЯ
          </button>
          
          <p className="text-center text-gray-500 text-xs mt-3">
            Нажимая кнопку, вы подтверждаете ознакомление с политикой конфиденциальности
          </p>
        </div>
      </div>
    </div>
  );
}