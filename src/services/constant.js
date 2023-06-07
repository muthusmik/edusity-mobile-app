//dev
// export const baseUrl="https://backend-linux-login.azurewebsites.net/";
// export const baseUrl_payment="https://backend-linux-payment.azurewebsites.net/";

//live
export const baseUrl = "https://dev-login.edusity.com/";
export const baseUrl_payment = "https://dev-payment.edusity.com/";

//newlogin.edusity.com
//export const baseUrl="http://newlogin.edusity.com/";
//export const baseUrl_payment = "http://newpayment.edusity.com/";

export const razorpayKeyLive = "rzp_live_4dB1won2fq0OGC"
// export const stripepayKeyLive = "pk_live_51KH8a5HZfVayCJxUc1UiLdfqx2TWxmV4m2d2wsHHNt6exI672HoyLuO9r6c7xW4GJJEpC2avbRXDUdUDoBTTXksj00ePrfGBwe"
export const STRIPE_PUBLIC_KEY = "pk_test_51KH8a5HZfVayCJxUw9JkpAq7mIwLFQq3hP6nCBHNgzfkb4aQwDamjFjX2KTykJkIp8DSXxkShZ4gmLtdTIpsOCip00nMXp4rAn"
export const STRIPE_PRIVATE_KEY = "sk_test_51KH8a5HZfVayCJxUlHXbTQutnzjtqPrGgr8mxT96YcGOo4aCnNYfNUjET6n36PC250CguDza0SH4AhXcYsH7fKvz000FwI3mBW"
export const BBB_WEBINAR_API_URL = "https://live2.u3academy.org/edusity/api/"
export const BBB_WEBINAR_API_SECRET = "TidrghpknQYRib9vYkgYz49cYPY8rul4YVa1m2V6Q"

export const loginUrl = baseUrl + "login";
export const signupUrl = baseUrl + "sign-up"; //https://dev-login.edusity.com/sign-up
export const forgotPasswordUrl = baseUrl + "forgot-password"; //https://dev-login.edusity.com/forgot-password
export const verificationLinkUrl = baseUrl + "get-verification-link";
export const passwordResetUrl = baseUrl + "reset";
export const userUrl = baseUrl + "user";
export const wishlistUrl = baseUrl_payment + "/wishlist/";
export const courseListUrl = baseUrl_payment + "v1/course";
export const ViewCourseUrl = baseUrl + "course/";
export const OTPUrl = baseUrl + "send-otp";
export const cartListUrl = baseUrl_payment + "v2/cart";
export const deleteItemUrl = baseUrl_payment + "v2/cart/";
export const wishlist = baseUrl + "/wishlist/";
export const getPurchasedUrl = baseUrl + "/course/purchased?page=";
export const verifyUrl = baseUrl + "verify-otp";
export const searchUrl = baseUrl + "search/course?search=";
export const updateProfileUrl = baseUrl + "user/profile";
export const checkoutUrl = baseUrl_payment + "v2/checkout";
export const webinarListUrl = baseUrl + "webinar/all?startDate=2023%2005,01&endDate=2023%2005,31";
export const generateWebinarTokenUrl = baseUrl + "webinar/join?webinarId=";
export const intentPayment = baseUrl_payment + "react-native-stripe-payment-sheet"
export const userDeleteUrl = baseUrl_payment + "user/v1";
export const userDeactiveUrl = baseUrl_payment + "user/v1/deactive";
// new api urls
// https://dev-payment.edusity.com/course-annnouncement get
export const courseAnnouncementUrl = baseUrl_payment + "course-annnouncement";
// https://dev-login.edusity.com/student/statistics
export const studentStatisticsUrl = baseUrl + "student/statistics";
// https://dev-login.edusity.com/webinar/upcomming
export const upcommingWebniarsUrl = baseUrl + "webinar/upcomming";
// https://dev-login.edusity.com/test/list
export const testListUrl = baseUrl + "test/list";