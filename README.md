# Code Challenge: Rate Limiter (Functional Approach)

## Descripción:
El objetivo de este desafío es implementar una función rateLimiter que controle la cantidad de solicitudes permitidas desde una misma dirección IP dentro de un período de tiempo específico. Esta función debe ser capaz de manejar múltiples IPs y debe reiniciar el contador de solicitudes una vez que la ventana de tiempo expire.

## Requisitos:
- Función rateLimiter(config): Debes implementar una función llamada rateLimiter que reciba un objeto config como argumento.
- Objeto config: Este objeto tendrá las siguientes propiedades:
    - maxRequests: (number) El número máximo de solicitudes permitidas.
    - timeWindowInSeconds: (number) La ventana de tiempo en segundos durante la cual se aplica el límite de solicitudes.
- Función allowRequest(ipAddress) (Retorno de rateLimiter): La funcion rateLimiter debe retornar una función allowRequest que debe recibir una dirección IP como argumento (string) y devolver un valor booleano (true o false).
    - Devuelve true si la solicitud está permitida (es decir, no se ha alcanzado el límite de solicitudes para esa IP en la ventana de tiempo actual).
    - Devuelve false si la solicitud no está permitida (es decir, se ha alcanzado el límite de solicitudes para esa IP en la ventana de tiempo actual).
- Lógica de Limite de tasa:
    - La funcion allowRequest debe llevar un registro del numero de requests por IP.
    - La funcion allowRequest debe resetear el contador de requests por IP una vez que la ventana de tiempo haya caducado.
- Implementación: Debes implementar la lógica interna dentro de rateLimiter para que allowRequest pueda registrar las solicitudes, mantener un contador por IP y reiniciar el contador cuando expire la ventana de tiempo.
- Manejo de Multiples IP: La funcion allowRequest debe poder manejar solicitudes de multiples IPs distintas.

## Ejemplo de uso:
```js
const limiter = rateLimiter({
    maxRequests: 5,
    timeWindowInSeconds: 1
});

// Primera solicitud permitida
console.log(limiter('1.2.3.4')); // true
console.log(limiter('1.2.3.4')); // true
console.log(limiter('1.2.3.4')); // true
console.log(limiter('1.2.3.4')); // true
// Quinta solicitud permitida
console.log(limiter('1.2.3.4')); // true
// Límite alcanzado
console.log(limiter('1.2.3.4')); // false

//Probar otra IP
console.log(limiter('5.6.7.8')); // true
console.log(limiter('5.6.7.8')); // true
console.log(limiter('5.6.7.8')); // true

// Esperar 1 segundo
setTimeout(() => {
    console.log(limiter('1.2.3.4')); // true (ventana de tiempo se reinicia)
    console.log(limiter('5.6.7.8')); // true (ventana de tiempo se reinicia)
}, 1000);
```

## Test Cases

### Test Case 1: Cero `maxRequests`

- Configuración
    - `maxRequest`: 0
    - `timeWindowInSeconds`: 5
- Comportamiento esperado:
    - `allowRequest('1.2.3.4')` debe regresar `false` (siempre bloqueado).
    - `allowRequest('5.6.7.8')` debe regresar `false` (siempre bloqueado).
    - No importa el tiempo transcurrido, ninguna solicitud debe ser permitida.

```javascript
// Test Case 1: Cero maxRequests
console.log("--- Test Case 1: Cero maxRequests ---");
const allowRequest = rateLimiter({ maxRequests: 0, timeWindowInSeconds: 5 });
console.log("  - allowRequest('1.2.3.4') debe regresar false:", allowRequest('1.2.3.4') === false);
console.log("  - allowRequest('5.6.7.8') debe regresar false:", allowRequest('5.6.7.8') === false);
setTimeout(() => {
console.log("  - After 6 seconds, allowRequest('1.2.3.4') debe regresar false:", allowRequest('1.2.3.4') === false);
}, 6000);
```

### Test Case 2: `timeWindowInSeconds` muy pequeño con múltiples IPs

- Configuración
    - `maxRequest`: 2
    - `timeWindowInSeconds`: 0.1
- Comportamiento esperado:
    - `allowRequest('10.0.0.1')` debe regresar `true` (Primera solicitud permitida).
    - `allowRequest('10.0.0.1')` debe regresar `true` (Segunda solicitud permitida).
    - `allowRequest('10.0.0.1')` debe regresar `false` (Límite alcanzado).
    - `allowRequest('10.0.0.2')` debe regresar `true` (Primera solicitud para una IP diferente).
    - `allowRequest('10.0.0.2')` debe regresar `true` (Segunda solicitud para una IP diferente).
    - `allowRequest('10.0.0.2')` debe regresar `false` (Límite alcanzado para la segunda IP).
    - Después de esperar por 0.1 segundos:
        - `allowRequest('10.0.0.1')` debe regresar `true` (Ventada reiniciada para la primera IP).
        - `allowRequest('10.0.0.2')` debe regresar `true` (Ventada reiniciada para la segunda IP).

```javascript
// Test Case 2: timeWindowInSeconds muy pequeño con múltiples IPs
console.log("\n--- Test Case 2: timeWindowInSeconds muy pequeño con múltiples IPs ---");
const allowRequest = rateLimiter({ maxRequests: 2, timeWindowInSeconds: 0.1 });
console.log("  - allowRequest('10.0.0.1') debe ser true:", allowRequest('10.0.0.1') === true);
console.log("  - allowRequest('10.0.0.1') debe ser true:", allowRequest('10.0.0.1') === true);
console.log("  - allowRequest('10.0.0.1') debe ser false:", allowRequest('10.0.0.1') === false);
console.log("  - allowRequest('10.0.0.2') debe ser true:", allowRequest('10.0.0.2') === true);
console.log("  - allowRequest('10.0.0.2') debe ser true:", allowRequest('10.0.0.2') === true);
console.log("  - allowRequest('10.0.0.2') debe ser false:", allowRequest('10.0.0.2') === false);
setTimeout(() => {
    console.log("  - 0.2 segundos después, allowRequest('10.0.0.1') debe ser true:", allowRequest('10.0.0.1') === true);
    console.log("  - 0.2 segundos después, allowRequest('10.0.0.2') debe ser true:", allowRequest('10.0.0.2') === true);
}, 200);
```

### Test Case 3: `maxRequests` alto y `timeWindowInSeconds` largo

- Configuración:
    - `maxRequests`: 100
    - `timeWindowInSeconds`: 10
- Comportamiento esperado:
    - `allowRequest('192.168.1.1')` debe devolver `true` (primera solicitud).
    - Repita `allowRequest('192.168.1.1')` 99 veces, todas deben devolver `true` (hasta la 100.ª).
    - `allowRequest('192.168.1.1')` debe devolver `false` (solicitud 101, límite alcanzado).
    - `allowRequest('192.168.1.2')` debe devolver `true` (primera solicitud para otra IP).
    - Repita `allowRequest('192.168.1.2')` 99 veces, todas deben devolver `true` (hasta la centésima).
    - Después de esperar 10 segundos:
        - `allowRequest('192.168.1.1')` debe devolver `true` (reinicio de ventana).
        - `allowRequest('192.168.1.2')` debe devolver `true` (reinicio de ventana).

```javascript
// Test Case 3: maxRequests alto y timeWindowInSeconds largo
console.log("\n--- Test Case 3: maxRequests alto y timeWindowInSeconds largo ---");
const allowRequest = rateLimiter({ maxRequests: 100, timeWindowInSeconds: 10 });
let allTrue = true;
for (let i = 0; i < 100; i++) {
    allTrue = allTrue && allowRequest('192.168.1.1') === true;
}
console.log("  - Las primeras 100 solicitudes para '192.168.1.1' deben ser true:", allTrue);
console.log("  - La solicitud 101 para '192.168.1.1' debe ser false:", allowRequest('192.168.1.1') === false);

allTrue = true;
for (let i = 0; i < 100; i++) {
    allTrue = allTrue && allowRequest('192.168.1.2') === true;
}

console.log("  - Las primeras 100 solicitudes para '192.168.1.2' deben ser true:", allTrue);

setTimeout(() => {
    console.log("  - 11 sgundos después, allowRequest('192.168.1.1') debe ser true:", allowRequest('192.168.1.1') === true);
    console.log("  - 11 sgundos después, allowRequest('192.168.1.2') debe ser true:", allowRequest('192.168.1.2') === true);
}, 11000);
```