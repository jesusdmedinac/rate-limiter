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