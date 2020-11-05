audio = 0; 

function stop(){
      audio && audio.close((audio= 0)); // Остановка воспроизведения
} 

// Math.clamp(x,lower,upper) более удобна для задания интервала значений,
// но всё еще не поддерживается в большинстве браузеров.
// Простая реализация этой функции
clamp = (x = 0, a, b) => (x < a && (x = a), x > b ? b : x); 

function play(s, bpm){
  // Создание AudioContext
  audio = new AudioContext() || webkitAudioContext;
  let gain_var = audio.createGain();
  let oscillator = audio.createOscillator();
  // Прямоугольные сигналы используются для создания эффекта "звучание старых телефонов"
  oscillator.type = 'square';
  oscillator.connect(gain_var);
  gain_var.connect(audio.destination);
  oscillator.start();


  let time = 0; // счетчик времени, секунды

  function value_at_time(x, v){
        x.setValueAtTime(v, time); 
  }

  for (m of s.matchAll(/(\d*)?(\.?)(#?)([a-g-])(\d*)/g)) {
      // m[1] - продолжительность ноты
      // m[2] - "точка" в ноте (проигрывается в два раза дольше)
      // m[3] - диез (#)
      // m[4] - сама нота
      // m[5] - номер октавы

      // ASCII код ноты
      k = m[4].charCodeAt(); 
/*
              A#        C#    D#       F#    G#    A#         <- 'черные клавиши'
            A     B | C     D     E  F     G     A     B | C   <- 'белые клавиши'
            --------+------------------------------------+---
      k&7:  1     2 | 3     4     5  6     7     1     2 | 3
            --------+------------------------------------+---
      нота: 9 10 11 | 0  1  2  3  4  5  6  7  8  9 10 11 | 0
*/
    
      let n = 0 | ((((k & 7) * 1.6 + 8) % 12) + 
          !!m[3] + 
          12 * clamp(m[5], 1, 3)); 

      value_at_time(oscillator.frequency, 261.63 * 2 ** (n / 12));
      value_at_time(gain_var.gain, (~k & 8) / 8);
      // Длительность ноты измеряется в 1/10 секундах
      duration = (24 / bpm / clamp(m[1] || 4, 1, 64)) * (1 + !!m[2] / 2);
      time = time + duration * 7;
      value_at_time(gain_var.gain, 0);
      time = time + duration * 3;
    }
};












