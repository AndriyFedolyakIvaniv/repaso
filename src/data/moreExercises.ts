import type { Exercise } from '../types/math'

const choice = (label: string, value: string) => ({ label, value })

const makeText = (id: string, statement: string, answer: string, points = 15): Exercise => ({
  id,
  title: statement,
  statement,
  kind: 'text',
  answer,
  acceptableAnswers: [answer],
  points,
  hintSteps: ['Pista: piensa en la operación.', 'Descompón si te ayuda.'],
  solutionSteps: [`${statement} = ${answer}`],
  explanation: 'Ejercicio de práctica automática.',
})

const makeChoice = (id: string, statement: string, answer: string, opts: string[], points = 15): Exercise => ({
  id,
  title: statement,
  statement,
  kind: 'choice',
  answer,
  options: opts.map((o) => choice(o, o)),
  points,
  hintSteps: ['Fíjate en las opciones.', 'Descarta la que no encaja.'],
  solutionSteps: [`Respuesta: ${answer}`],
  explanation: 'Ejercicio de opción múltiple.',
})

export const buildNaturalesExercises = (): Exercise[] => {
  const exercises: Exercise[] = []
  // Genera 75 ejercicios: 15 por cada uno de los 5 niveles
  for (let i = 0; i < 75; i++) {
    const idx = i + 1
    if (i % 5 === 0) {
      // suma sencilla
      exercises.push(makeText(`nat-${idx}`, `Calcula: ${idx} + ${i % 7}`, String(idx + (i % 7))))
    } else if (i % 5 === 1) {
      // resta
      const a = idx + 5
      const b = i % 6
      exercises.push(makeText(`nat-${idx}`, `Calcula: ${a} - ${b}`, String(a - b)))
    } else if (i % 5 === 2) {
      // multiplicación pequeña
      const a = (i % 9) + 2
      const b = ((i + 2) % 5) + 2
      exercises.push(makeText(`nat-${idx}`, `Calcula: ${a} · ${b}`, String(a * b)))
    } else if (i % 5 === 3) {
      // elecciones
      const correct = String((i % 10) + 1)
      const opts = [correct, String(((i + 3) % 10) + 1), String(((i + 5) % 10) + 1)]
      exercises.push(makeChoice(`nat-${idx}`, `¿Cuál es múltiplo de ${((i % 4) + 2)}?`, correct, opts))
    } else {
      // valor absoluto / negativos
      const val = (i % 11) - 5
      exercises.push(makeText(`nat-${idx}`, `Calcula: ${val} + ${Math.abs(val)}`, String(val + Math.abs(val))))
    }
  }

  return exercises
}

export const buildDivisibilidadExercises = (): Exercise[] => [
  {
    id: 'div-ext-1',
    title: 'Divisible por 3',
    statement: '¿Es 36 divisible por 3?',
    kind: 'choice',
    answer: 'sí',
    points: 15,
    options: [choice('Sí', 'sí'), choice('No', 'no')],
    hintSteps: ['Suma sus cifras: 3 + 6.', '9 es múltiplo de 3.', 'Por eso sí.'],
    solutionSteps: ['3 + 6 = 9', '9 es divisible por 3.', '36 también lo es.'],
    explanation: 'El criterio del 3 usa la suma de las cifras.',
  },
  {
    id: 'div-ext-2',
    title: 'Divisible por 2',
    statement: '¿Es 70 divisible por 2?',
    kind: 'choice',
    answer: 'sí',
    points: 15,
    options: [choice('Sí', 'sí'), choice('No', 'no')],
    hintSteps: ['Mira el último dígito.', 'Los pares terminan en 0, 2, 4, 6, 8.', '70 termina en 0.'],
    solutionSteps: ['70 termina en 0.', 'Sí es divisible por 2.'],
    explanation: 'Los números pares siempre son divisibles por 2.',
  },
  {
    id: 'div-ext-3',
    title: 'Divisible por 9',
    statement: '¿Es 81 divisible por 9?',
    kind: 'choice',
    answer: 'sí',
    points: 20,
    options: [choice('Sí', 'sí'), choice('No', 'no')],
    hintSteps: ['Suma las cifras.', '8 + 1 = 9.', '9 es múltiplo de 9.'],
    solutionSteps: ['8 + 1 = 9', '9 es divisible por 9.', '81 también.'],
    explanation: 'Si la suma de las cifras es múltiplo de 9, el número lo es.',
  },
  {
    id: 'div-ext-4',
    title: 'm.c.m.',
    statement: 'Calcula el m.c.m. de 4 y 6',
    kind: 'text',
    answer: '12',
    acceptableAnswers: ['12'],
    points: 25,
    hintSteps: ['Escribe múltiplos de ambos.', 'Busca el primero que repiten.', '4, 8, 12... y 6, 12...'],
    solutionSteps: ['Múltiplos comunes: 12, 24...', 'El menor es 12.'],
    explanation: 'El m.c.m. es el primer múltiplo común.',
  },
  {
    id: 'div-ext-5',
    title: 'm.c.d.',
    statement: 'Calcula el m.c.d. de 8 y 12',
    kind: 'text',
    answer: '4',
    acceptableAnswers: ['4'],
    points: 25,
    hintSteps: ['Busca divisores comunes.', 'El mayor de ellos es el m.c.d.', '8 y 12 comparten 1, 2 y 4.'],
    solutionSteps: ['Divisores comunes: 1, 2 y 4.', 'El mayor es 4.'],
    explanation: 'El m.c.d. es el divisor común más grande.',
  },
  {
    id: 'div-ext-6',
    title: 'Criterio del 10',
    statement: '¿Es 120 divisible por 10?',
    kind: 'choice',
    answer: 'sí',
    points: 15,
    options: [choice('Sí', 'sí'), choice('No', 'no')],
    hintSteps: ['Mira el último dígito.', 'Los que acaban en 0 son divisibles por 10.', '120 acaba en 0.'],
    solutionSteps: ['120 acaba en 0.', 'Sí es divisible por 10.'],
    explanation: 'El 10 mira si el número termina en 0.',
  },
  {
    id: 'div-ext-7',
    title: 'Busca un divisor',
    statement: 'Escribe un divisor de 30 mayor que 5',
    kind: 'text',
    answer: '6',
    acceptableAnswers: ['6', '10', '15', '30'],
    points: 20,
    hintSteps: ['Prueba números que encajen exacto en 30.', '6, 10, 15 y 30 sirven.', '6 es una respuesta válida.'],
    solutionSteps: ['30 ÷ 6 = 5', 'No sobra nada.', '6 es divisor de 30.'],
    explanation: 'Un divisor exacto divide sin resto.',
  },
  {
    id: 'div-ext-8',
    title: 'Multiplo o no',
    statement: '¿Cuál es múltiplo de 8?',
    kind: 'choice',
    answer: '24',
    points: 15,
    options: [choice('24', '24'), choice('28', '28')],
    hintSteps: ['8 · 3 = 24.', '8 · 4 = 32.', '24 sí encaja.'],
    solutionSteps: ['24 = 8 · 3', 'Por eso 24 es múltiplo de 8.'],
    explanation: 'Los múltiplos se obtienen multiplicando.',
  },
  {
    id: 'div-ext-9',
    title: 'm.c.m. rápido',
    statement: 'Calcula el m.c.m. de 5 y 10',
    kind: 'text',
    answer: '10',
    acceptableAnswers: ['10'],
    points: 20,
    hintSteps: ['10 ya es múltiplo de 5 y de 10.', 'Busca el más pequeño común.', 'Es 10.'],
    solutionSteps: ['10 es múltiplo de 5.', '10 es múltiplo de 10.', 'Resultado: 10'],
    explanation: 'Si uno ya es múltiplo del otro, ese número es el m.c.m.',
  },
  {
    id: 'div-ext-10',
    title: 'Divisible por 5',
    statement: '¿Es 245 divisible por 5?',
    kind: 'choice',
    answer: 'sí',
    points: 15,
    options: [choice('Sí', 'sí'), choice('No', 'no')],
    hintSteps: ['Mira el último dígito.', '5 y 0 son la clave.', '245 acaba en 5.'],
    solutionSteps: ['245 acaba en 5.', 'Sí es divisible por 5.'],
    explanation: 'El 5 mira el último dígito.',
  },
]

export const buildFraccionesExercises = (): Exercise[] => [
  {
    id: 'fra-ext-1',
    title: 'Simplificar',
    statement: 'Simplifica 2/6',
    kind: 'text',
    answer: '1/3',
    acceptableAnswers: ['1/3'],
    points: 15,
    hintSteps: ['Divide numerador y denominador entre 2.', '2 ÷ 2 = 1 y 6 ÷ 2 = 3.', 'Resultado: 1/3.'],
    solutionSteps: ['2/6 = 1/3'],
    explanation: 'Simplificar es reducir la fracción sin cambiar su valor.',
  },
  {
    id: 'fra-ext-2',
    title: 'Suma con mismo denominador',
    statement: 'Calcula: 1/2 + 1/4',
    kind: 'text',
    answer: '3/4',
    acceptableAnswers: ['3/4'],
    points: 25,
    hintSteps: ['Convierte 1/2 a 2/4.', 'Luego suma arriba.', '2/4 + 1/4 = 3/4.'],
    solutionSteps: ['1/2 = 2/4', '2/4 + 1/4 = 3/4'],
    explanation: 'Primero igualas denominadores y luego sumas numeradores.',
  },
  {
    id: 'fra-ext-3',
    title: 'Resta con mismo denominador',
    statement: 'Calcula: 5/6 - 1/6',
    kind: 'text',
    answer: '2/3',
    acceptableAnswers: ['2/3', '4/6'],
    points: 25,
    hintSteps: ['Resta arriba: 5 - 1.', '6 se queda igual.', '4/6 se simplifica a 2/3.'],
    solutionSteps: ['5/6 - 1/6 = 4/6', '4/6 se simplifica a 2/3'],
    explanation: 'Si el denominador coincide, la resta es directa.',
  },
  {
    id: 'fra-ext-4',
    title: 'Fracción de una cantidad',
    statement: 'Calcula 2/5 de 15',
    kind: 'text',
    answer: '6',
    acceptableAnswers: ['6'],
    points: 25,
    hintSteps: ['15 ÷ 5 = 3.', '3 × 2 = 6.', 'Resultado: 6.'],
    solutionSteps: ['15 ÷ 5 = 3', '3 × 2 = 6'],
    explanation: 'Primero divides entre el denominador y luego multiplicas por el numerador.',
  },
  {
    id: 'fra-ext-5',
    title: 'Otra fracción de cantidad',
    statement: 'Calcula 3/4 de 8',
    kind: 'text',
    answer: '6',
    acceptableAnswers: ['6'],
    points: 25,
    hintSteps: ['8 ÷ 4 = 2.', '2 × 3 = 6.', 'Resultado: 6.'],
    solutionSteps: ['8 ÷ 4 = 2', '2 × 3 = 6'],
    explanation: 'La fracción de una cantidad siempre sigue la misma receta.',
  },
  {
    id: 'fra-ext-6',
    title: 'Compara fracciones',
    statement: '¿Cuál es mayor: 2/3 o 3/5?',
    kind: 'choice',
    answer: '2/3',
    points: 20,
    options: [choice('2/3', '2/3'), choice('3/5', '3/5')],
    hintSteps: ['Convierte mentalmente a decimales si quieres.', '2/3 es aproximadamente 0,66.', '3/5 es 0,6.'],
    solutionSteps: ['2/3 ≈ 0,66', '3/5 = 0,6', '2/3 es mayor.'],
    explanation: 'Comparar fracciones a veces es más fácil pasando por decimales.',
  },
  {
    id: 'fra-ext-7',
    title: 'Multiplica fracciones',
    statement: 'Calcula: 1/2 · 2/3',
    kind: 'text',
    answer: '1/3',
    acceptableAnswers: ['1/3'],
    points: 30,
    hintSteps: ['Multiplica arriba con arriba y abajo con abajo.', '1 × 2 = 2 y 2 × 3 = 6.', '2/6 se simplifica.'],
    solutionSteps: ['1/2 · 2/3 = 2/6', '2/6 = 1/3'],
    explanation: 'Multiplicar fracciones es directo y luego conviene simplificar.',
  },
  {
    id: 'fra-ext-8',
    title: 'Fracción equivalente',
    statement: 'Escribe una fracción equivalente a 3/5',
    kind: 'text',
    answer: '6/10',
    acceptableAnswers: ['6/10', '9/15'],
    points: 20,
    hintSteps: ['Multiplica arriba y abajo por 2.', '3 × 2 = 6 y 5 × 2 = 10.', '6/10 vale lo mismo.'],
    solutionSteps: ['3/5 × 2/2 = 6/10'],
    explanation: 'Las fracciones equivalentes mantienen el mismo valor.',
  },
  {
    id: 'fra-ext-9',
    title: 'Ordena fracciones',
    statement: '¿Cuál es menor: 1/5 o 1/3?',
    kind: 'choice',
    answer: '1/5',
    points: 15,
    options: [choice('1/5', '1/5'), choice('1/3', '1/3')],
    hintSteps: ['Con el mismo numerador, más denominador = trozos más pequeños.', '1/5 tiene trozos más pequeños que 1/3.', '1/5 es menor.'],
    solutionSteps: ['1/5 divide en 5 partes.', '1/3 divide en 3 partes.', '1/5 es menor.'],
    explanation: 'Más partes iguales significa partes más pequeñas.',
  },
  {
    id: 'fra-ext-10',
    title: 'Suma fácil',
    statement: 'Calcula: 2/4 + 1/4',
    kind: 'text',
    answer: '3/4',
    acceptableAnswers: ['3/4'],
    points: 20,
    hintSteps: ['Mismo denominador, suma arriba.', '2 + 1 = 3.', 'Resultado: 3/4.'],
    solutionSteps: ['2/4 + 1/4 = 3/4'],
    explanation: 'Con el mismo denominador, la suma es directa.',
  },
]

export const buildDecimalesExercises = (): Exercise[] => [
  {
    id: 'dec-ext-1',
    title: 'Suma decimal',
    statement: 'Calcula: 5,2 + 3,6',
    kind: 'text',
    answer: '8,8',
    acceptableAnswers: ['8,8', '8.8'],
    points: 15,
    hintSteps: ['Alinea las comas.', '2 + 6 = 8 y 5 + 3 = 8.', 'Resultado: 8,8.'],
    solutionSteps: ['5,2 + 3,6 = 8,8'],
    explanation: 'Suma parte entera con parte entera y decimal con decimal.',
  },
  {
    id: 'dec-ext-2',
    title: 'Resta decimal',
    statement: 'Calcula: 9,1 - 2,4',
    kind: 'text',
    answer: '6,7',
    acceptableAnswers: ['6,7', '6.7'],
    points: 15,
    hintSteps: ['Alinea las comas.', '9,1 es 9,10 si te ayuda.', '10 - 4 = 6 y 9 - 2 = 7.'],
    solutionSteps: ['9,1 - 2,4 = 6,7'],
    explanation: 'La resta decimal funciona igual que con enteros, pero con coma.',
  },
  {
    id: 'dec-ext-3',
    title: 'Multiplica por 10',
    statement: 'Calcula: 0,7 · 10',
    kind: 'text',
    answer: '7',
    acceptableAnswers: ['7', '7,0'],
    points: 15,
    hintSteps: ['La coma se mueve un lugar a la derecha.', '0,7 pasa a 7.', 'Es un cambio rápido.'],
    solutionSteps: ['0,7 · 10 = 7'],
    explanation: 'Multiplicar por 10 desplaza la coma una posición.',
  },
  {
    id: 'dec-ext-4',
    title: 'Redondeo a unidades',
    statement: 'Redondea 4,83 a la unidad más cercana',
    kind: 'text',
    answer: '5',
    acceptableAnswers: ['5'],
    points: 20,
    hintSteps: ['Mira la décima.', 'Si es 5 o más, sube la unidad.', 'La décima es 8.'],
    solutionSteps: ['4,83 se redondea a 5'],
    explanation: 'Para redondear a unidades, miras la primera cifra decimal.',
  },
  {
    id: 'dec-ext-5',
    title: 'Compara decimales',
    statement: '¿Cuál es mayor: 3,09 o 3,9?',
    kind: 'choice',
    answer: '3,9',
    points: 15,
    options: [choice('3,09', '3,09'), choice('3,9', '3,9')],
    hintSteps: ['Escribe 3,9 como 3,90.', 'Compara 3,09 y 3,90.', '3,90 es mayor.'],
    solutionSteps: ['3,9 = 3,90', '3,90 > 3,09', '3,9 es mayor.'],
    explanation: 'Los ceros ayudan a comparar sin cambiar el valor.',
  },
  {
    id: 'dec-ext-6',
    title: 'Suma exacta',
    statement: 'Calcula: 2,25 + 1,75',
    kind: 'text',
    answer: '4',
    acceptableAnswers: ['4', '4,0'],
    points: 25,
    hintSteps: ['Suma centésimas y décimas.', '0,25 + 0,75 = 1.', '2 + 1 + 1 = 4.'],
    solutionSteps: ['2,25 + 1,75 = 4'],
    explanation: 'A veces los decimales encajan justo para dar un entero.',
  },
  {
    id: 'dec-ext-7',
    title: 'Resta con ceros',
    statement: 'Calcula: 6,4 - 0,8',
    kind: 'text',
    answer: '5,6',
    acceptableAnswers: ['5,6', '5.6'],
    points: 15,
    hintSteps: ['Convierte 6,4 en 6,40 si lo necesitas.', '6,40 - 0,80 = 5,60.', 'Resultado: 5,6.'],
    solutionSteps: ['6,4 - 0,8 = 5,6'],
    explanation: 'Completar con ceros ayuda a no perder posiciones.',
  },
  {
    id: 'dec-ext-8',
    title: 'Redondeo a décimas',
    statement: 'Redondea 8,44 a la décima más cercana',
    kind: 'text',
    answer: '8,4',
    acceptableAnswers: ['8,4', '8.4'],
    points: 20,
    hintSteps: ['Mira la centésima.', 'Si es menor que 5, la décima se queda igual.', 'La centésima es 4.'],
    solutionSteps: ['8,44 → 8,4'],
    explanation: 'La centésima decide si la décima sube o no.',
  },
  {
    id: 'dec-ext-9',
    title: 'Multiplica por 10 otra vez',
    statement: 'Calcula: 1,5 · 10',
    kind: 'text',
    answer: '15',
    acceptableAnswers: ['15', '15,0'],
    points: 15,
    hintSteps: ['La coma avanza una casilla.', '1,5 pasa a 15.', 'Es un desplazamiento.'],
    solutionSteps: ['1,5 · 10 = 15'],
    explanation: 'Multiplicar por 10 mueve la coma a la derecha.',
  },
  {
    id: 'dec-ext-10',
    title: 'Mayor decimal',
    statement: '¿Cuál es mayor: 0,45 o 0,5?',
    kind: 'choice',
    answer: '0,5',
    points: 15,
    options: [choice('0,45', '0,45'), choice('0,5', '0,5')],
    hintSteps: ['Escribe 0,5 como 0,50.', '0,50 > 0,45.', '0,5 es mayor.'],
    solutionSteps: ['0,5 = 0,50', '0,50 > 0,45', '0,5 es mayor.'],
    explanation: 'Para comparar decimales, completa con ceros si hace falta.',
  },
]

export const buildPotenciasExercises = (): Exercise[] => [
  {
    id: 'pot-ext-1',
    title: 'Potencia de 2',
    statement: 'Calcula: 2^5',
    kind: 'text',
    answer: '32',
    acceptableAnswers: ['32'],
    points: 15,
    hintSteps: ['2 · 2 · 2 · 2 · 2', '2^4 = 16 y 16 · 2 = 32.', 'Resultado: 32.'],
    solutionSteps: ['2^5 = 32'],
    explanation: 'Las potencias repiten la base tantas veces como diga el exponente.',
  },
  {
    id: 'pot-ext-2',
    title: 'Raíz exacta',
    statement: 'Calcula: √49',
    kind: 'text',
    answer: '7',
    acceptableAnswers: ['7'],
    points: 15,
    hintSteps: ['7 · 7 = 49.', 'La raíz es el número que buscabas.', 'Resultado: 7.'],
    solutionSteps: ['7 · 7 = 49', '√49 = 7'],
    explanation: 'La raíz cuadrada deshace el cuadrado.',
  },
  {
    id: 'pot-ext-3',
    title: 'Otra potencia',
    statement: 'Calcula: 5^2',
    kind: 'text',
    answer: '25',
    acceptableAnswers: ['25'],
    points: 15,
    hintSteps: ['5 · 5.', 'Multiplicar por sí mismo dos veces.', 'Resultado: 25.'],
    solutionSteps: ['5^2 = 25'],
    explanation: 'Elevar al cuadrado es multiplicar por el mismo número.',
  },
  {
    id: 'pot-ext-4',
    title: 'Raíz cuadrada',
    statement: 'Calcula: √36',
    kind: 'text',
    answer: '6',
    acceptableAnswers: ['6'],
    points: 15,
    hintSteps: ['6 · 6 = 36.', 'Entonces la raíz es 6.', 'Piensa en el cuadrado perfecto.'],
    solutionSteps: ['6 · 6 = 36', '√36 = 6'],
    explanation: 'Las raíces exactas son números enteros sencillos.',
  },
  {
    id: 'pot-ext-5',
    title: 'Potencia de 3',
    statement: 'Calcula: 3^3',
    kind: 'text',
    answer: '27',
    acceptableAnswers: ['27'],
    points: 20,
    hintSteps: ['3 · 3 · 3.', '3 · 3 = 9.', '9 · 3 = 27.'],
    solutionSteps: ['3^3 = 27'],
    explanation: 'El exponente 3 repite la base tres veces.',
  },
  {
    id: 'pot-ext-6',
    title: 'Potencia de 4',
    statement: 'Calcula: 4^3',
    kind: 'text',
    answer: '64',
    acceptableAnswers: ['64'],
    points: 20,
    hintSteps: ['4 · 4 · 4.', '4 · 4 = 16.', '16 · 4 = 64.'],
    solutionSteps: ['4^3 = 64'],
    explanation: 'Las potencias crecen rápido cuando el exponente sube.',
  },
  {
    id: 'pot-ext-7',
    title: 'Potencia fácil',
    statement: 'Calcula: 10^2',
    kind: 'text',
    answer: '100',
    acceptableAnswers: ['100'],
    points: 15,
    hintSteps: ['10 · 10.', 'El exponente 2 pide duplicar el 10.', 'Resultado: 100.'],
    solutionSteps: ['10^2 = 100'],
    explanation: 'Elevar 10 al cuadrado da 100.',
  },
  {
    id: 'pot-ext-8',
    title: 'Raíz exacta grande',
    statement: 'Calcula: √64',
    kind: 'text',
    answer: '8',
    acceptableAnswers: ['8'],
    points: 15,
    hintSteps: ['8 · 8 = 64.', 'Busca el número escondido.', 'La raíz es 8.'],
    solutionSteps: ['8 · 8 = 64', '√64 = 8'],
    explanation: 'La raíz cuadrada pregunta qué número estaba al cuadrado.',
  },
  {
    id: 'pot-ext-9',
    title: 'Base de la potencia',
    statement: 'En 6^2, ¿cuál es la base?',
    kind: 'choice',
    answer: '6',
    points: 10,
    options: [choice('6', '6'), choice('2', '2')],
    hintSteps: ['La base es el número que se repite.', 'El exponente es el pequeño de arriba.', 'La base es 6.'],
    solutionSteps: ['La base es 6.'],
    explanation: 'La base es el número principal que se multiplica.',
  },
  {
    id: 'pot-ext-10',
    title: 'Potencia y suma',
    statement: 'Calcula: 2^3 + 4',
    kind: 'text',
    answer: '12',
    acceptableAnswers: ['12'],
    points: 20,
    hintSteps: ['Primero 2^3.', '2^3 = 8.', '8 + 4 = 12.'],
    solutionSteps: ['2^3 = 8', '8 + 4 = 12'],
    explanation: 'Las potencias también respetan la prioridad de operaciones.',
  },
]

export const buildAlgebraExercises = (): Exercise[] => {
  const ex: Exercise[] = []
  for (let i = 0; i < 75; i++) {
    const idx = i + 1
    if (i % 3 === 0) {
      // ecuación simple ax + b = c (varía con mezclas modulares para evitar repeticiones)
      const a = ((i * 7) % 11) + 1
      const x = ((i * 13) % 17) + 1
      const b = ((i * 5) % 7)
      const c = a * x + b
      ex.push(makeText(`alg-${idx}`, `Resuelve: ${a}x + ${b} = ${c}`, String(x)))
    } else if (i % 3 === 1) {
      // expresión para evaluar (mezcla para diversidad)
      const a = ((i * 3) % 9) + 1
      const b = ((i * 11) % 13) + 1
      ex.push(makeText(`alg-${idx}`, `Calcula: ${a}x cuando x = ${b}`, String(a * b)))
    } else {
      // identificar término / incógnita - variar la expresión y la variable
      const coef = ((i * 2) % 7) + 1
      const vars = ['x', 'y', 'a', 'b']
      const varName = vars[i % vars.length]
      const add = ((i * 5) % 6)
      const expr = `${coef}${varName} + ${add}`
      const correct = varName
      const opts = [correct, vars[(i + 1) % vars.length], String(coef)]
      ex.push(makeChoice(`alg-${idx}`, `¿Cuál es la incógnita en ${expr}?`, correct, opts))
    }
  }
  return ex
}

export const buildGeometriaExercises = (): Exercise[] => {
  const ex: Exercise[] = []
  for (let i = 0; i < 75; i++) {
    const idx = i + 1
    if (i % 3 === 0) {
      const a = ((i * 7) % 12) + 1
      const b = ((i * 5) % 11) + 1
      ex.push(makeText(`geo-${idx}`, `Calcula el área de un rectángulo ${a} × ${b}`, String(a * b)))
    } else if (i % 3 === 1) {
      const r = ((i * 5) % 9) + 1
      const area = Math.round(Math.PI * r * r)
      ex.push(makeText(`geo-${idx}`, `Calcula (aprox.) el área de un círculo de radio ${r}`, String(area)))
    } else {
      // variar preguntas sobre polígonos
      const polygons = ['triángulo', 'cuadrado', 'pentágono', 'hexágono', 'heptágono', 'octágono', 'eneágono', 'decágono']
      const pick = (i * 3) % polygons.length
      const name = polygons[pick]
      const sides = pick + 3 // triángulo=3, cuadrado=4, ...
      const opts = [String(sides), String(Math.max(3, sides - 1)), String(sides + 1)]
      ex.push(makeChoice(`geo-${idx}`, `¿Cuántos lados tiene un ${name}?`, String(sides), opts))
    }
  }
  return ex
}

export const buildProporcionalidadExercises = (): Exercise[] => {
  const ex: Exercise[] = []
  for (let i = 0; i < 75; i++) {
    const idx = i + 1
    const a = ((i * 7) % 9) + 2
    const b = ((i * 11) % 13) + 2
    // variar multiplicador k para generar distintos enunciados
    const k = ((i * 5) % 4) + 2 // 2..5
    // si a lápices cuestan b €, entonces k·a lápices cuestan b*k €
    const price = b * k
    ex.push(makeText(`prop-${idx}`, `Si ${a} lápices cuestan ${b} €, ¿cuánto cuestan ${a * k} lápices?`, String(price)))
  }
  return ex
}
