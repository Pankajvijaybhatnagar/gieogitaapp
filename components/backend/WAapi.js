fullUrl = `https://parivaar.gieogita.org/login/api/_api_config.php`;

export const sendOtp = async (phoneNumber) => {
  try {
    // Validate phone number format (basic regex check)
    if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phoneNumber)) {
      throw new Error("Invalid phone number format.");
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const message = `Your verification code is: ${otp}`;

    // Create a FormData object
    const formData = new FormData();
    formData.append("phone", phoneNumber);
    formData.append("message", message);

    // Send the GET request to the API
    const response = await fetch(fullUrl, {
      method: 'POST',
      body: formData,
      headers: {
        // 'Content-Type' is not needed when sending FormData,
        // fetch automatically sets it with proper boundary.
        // 'Content-Type': 'multipart/form-data'
      },
    }).catch((networkError) => {
      // Handle fetch-level errors (like no internet)
      console.error("Network Error:", networkError);
      throw new Error("Network error occurred while sending OTP.");
    });

    // Log response status and headers
    console.log("Response Status:", response.status);
    //console.log("Response Headers:", JSON.stringify([...response.headers]));

    // Get the response text
    const responseText = await response.text();
    console.log("Response Text:", responseText);

    // Check if the response is okay (2xx status codes)
    if (!response.ok) {
      console.error("Detailed Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      });
      throw new Error(`Error sending OTP: ${responseText}`);
    }

    // Check content type for JSON
    //const contentType = response.headers.get("Content-Type");
    let data;
    data = JSON.parse(responseText); // Parse JSON response
    // if (contentType && contentType.includes("application/json")) {
    // } else {
    //   throw new Error(`Unexpected content type: ${contentType}`);
    // }

    // Return success response
    return {
      success: true,
      otp,
      data,
    };
  } catch (error) {
    console.error("Caught Error:", error); // Log the error for debugging
    return {
      success: false,
      error: error.message,
    };
  }
};

// // Example usage
// (async () => {
//   const phoneNumber = "+919817503069"; // Replace with the actual phone number
//   const result = await sendOtp(phoneNumber);
//   console.log(result);
// })();
