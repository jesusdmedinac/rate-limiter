function rateLimiter(config) {
    const { maxRequests, timeWindowInSeconds } = config;
    const requestCounts = {}; // { ipAddress: { count: number, resetTime: number } }
  
    return function allowRequest(ipAddress) {
      const now = Date.now();
      const resetTime = (requestCounts[ipAddress]?.resetTime || 0);
  
      if (!requestCounts[ipAddress] || now >= resetTime ) {
          requestCounts[ipAddress] = {
              count: 0,
              resetTime: now + (timeWindowInSeconds * 1000),
          };
      }
  
      if (maxRequests === 0) {
        return false; // Always block if maxRequests is 0
      }
  
      if (requestCounts[ipAddress].count < maxRequests) {
        requestCounts[ipAddress].count++;
        return true;
      } else {
        return false;
      }
    };
}
  
// Test Cases
function runTestCases() {
    // Test Case 1: Zero maxRequests
    console.log("--- Test Case 1: Zero maxRequests ---");
    const limiter1 = rateLimiter({ maxRequests: 0, timeWindowInSeconds: 5 });
    console.log("  - limiter1('1.2.3.4') should be false:", limiter1('1.2.3.4') === false);
    console.log("  - limiter1('5.6.7.8') should be false:", limiter1('5.6.7.8') === false);
    setTimeout(() => {
      console.log("  - After 6 seconds, limiter1('1.2.3.4') should be false:", limiter1('1.2.3.4') === false);
    }, 6000);
  
    // Test Case 2: Very Short timeWindowInSeconds with Multiple IPs
    console.log("\n--- Test Case 2: Very Short timeWindowInSeconds with Multiple IPs ---");
    const limiter2 = rateLimiter({ maxRequests: 2, timeWindowInSeconds: 0.2 });
    console.log("  - limiter2('10.0.0.1') should be true:", limiter2('10.0.0.1') === true);
    console.log("  - limiter2('10.0.0.1') should be true:", limiter2('10.0.0.1') === true);
    console.log("  - limiter2('10.0.0.1') should be false:", limiter2('10.0.0.1') === false);
    console.log("  - limiter2('10.0.0.2') should be true:", limiter2('10.0.0.2') === true);
    console.log("  - limiter2('10.0.0.2') should be true:", limiter2('10.0.0.2') === true);
    console.log("  - limiter2('10.0.0.2') should be false:", limiter2('10.0.0.2') === false);
    setTimeout(() => {
      console.log("  - After 0.3 seconds, limiter2('10.0.0.1') should be true:", limiter2('10.0.0.1') === true);
      console.log("  - After 0.3 seconds, limiter2('10.0.0.2') should be true:", limiter2('10.0.0.2') === true);
    }, 300);
  
    // Test Case 3: High maxRequests and Long timeWindowInSeconds
    console.log("\n--- Test Case 3: High maxRequests and Long timeWindowInSeconds ---");
    const limiter3 = rateLimiter({ maxRequests: 100, timeWindowInSeconds: 10 });
    let allTrue = true;
    for (let i = 0; i < 100; i++) {
      allTrue = allTrue && limiter3('192.168.1.1') === true;
    }
    console.log("  - First 100 requests for '192.168.1.1' should be true:", allTrue);
    console.log("  - 101st request for '192.168.1.1' should be false:", limiter3('192.168.1.1') === false);
  
    allTrue = true;
     for (let i = 0; i < 100; i++) {
      allTrue = allTrue && limiter3('192.168.1.2') === true;
    }
  
      console.log("  - First 100 requests for '192.168.1.2' should be true:", allTrue);
  
    setTimeout(() => {
      console.log("  - After 11 seconds, limiter3('192.168.1.1') should be true:", limiter3('192.168.1.1') === true);
      console.log("  - After 11 seconds, limiter3('192.168.1.2') should be true:", limiter3('192.168.1.2') === true);
    }, 11000);
}

runTestCases();
  