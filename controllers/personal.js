
const  Payment  = require("../models/payment");
const Productes  = require("../models/productes");


// ============ User define imports end  ================

// ============ post personal function Start ================
async function postpersonal(req, res) {
  try {
    const {
      first_name,
      last_name,
      address,
      payment_Method,
      city,
      state,
      country,
      name_On_Card,
      card_Number,
      zip,
      expiry,
      cvv,
      date,
      products
    } = req.body;

    // Check if session data is available
    if (!req.session.userId || !req.session.userName || !req.session.userEmail) {
      return res.status(401).json({ message: "Unauthorized. User session missing." });
    }

    const newPayment = {
      userId: req.session.userId,
      userName: req.session.userName,
      userEmail: req.session.userEmail,
      first_name,
      last_name,
      address,
      payment_Method,
      city,
      state,
      country,
      name_On_Card,
      card_Number,
      zip,
      expiry,
      cvv,
      date,
      products // ✅ contains full product detail from frontend
    };

    const saved = await Payment.create(newPayment);
    res.status(201).json({ message: "Payment saved successfully", saved });
  } catch (error) {
    console.error("Error in postpersonal:", error);
    res.status(500).json({ message: "Failed to save payment", error: error.message });
  }
}

// async function postpersonal(req, res) {
//   try {
//     const data = req.body;

//     const products = req.body.products; // ✅ Angular se aane wale cart products
//     if (!products || products.length === 0) {
//       return res.status(400).json({ error: "Cart is empty." });
//     }

//     const userId = req.session?.id || null;
//     const userName = req.session?.userName || "Unknown";
//     const userEmail = req.session?.userEmail || "unknown@example.com";
//    console.log(userId);
//     const date = new Date().toLocaleDateString();
//    console.log(date);

//     const paymentData = {
//       ...data,
//       products,
//       userId,
//       userName,
//       userEmail,
//       date,
//     };

//     await Payment.create(paymentData);

//     // Session cart clear karna zaroori nahi agar session use nahi ho raha
//     // req.session.cart = [];

//     res.status(200).json({ message: "Payment successful", success: true });
//   } catch (err) {
//     console.error("Database insert error:", err);

//     if (err.name === "ValidationError") {
//       const validationErrors = Object.values(err.errors).map((error) => error.message);
//       return res.status(400).json({ errors: validationErrors });
//     }

//     res.status(500).json({ error: "An internal server error occurred." });
//   }
// }

module.exports = { postpersonal };




// ============ get personal function Start ================

async function getpersonal(req, res) {
    const productId = req.query.id;
    const adults_no = parseInt(req.query.adults_no, 10) || 0;
    const kids_no = parseInt(req.query.kids_no, 10) || 0;
    const check_in = req.query.check_in || null;
    const check_out = req.query.check_out ;
    const days_count = parseInt(req.query.days_count, 10) || 0;
    const total_no = parseInt(req.query.total_no, 10) || 0;
    const totalCost = parseFloat(req.query.totalCost) || 0;
    const order_date = req.query.check_out_date;
    const total_persones = adults_no + kids_no;
    try {
      // Fetch the product details from the database  
      const products = await Productes.findById(productId);
      if (!products) {
        return res.status(404).json({ error: "Product not found" });
      }

    // Fetch the product details from the database

    if (!products) {
      return res.status(404).json({ error: "Product not found" });
    }
// console.log(total_persones);
    const product_Quantity = products.quantity;
    // console.log("Product quantity is " + product_Quantity);
    // Fetch all payment records from the database
    const payments = await Payment.find();

    // console.log("Payments data:", payments);
    // Calculate totals for the specific product and date
    let totalAdults = 0;
    let totalKids = 0;

    // Helper function to compare only the date part
    function areDatesEqual(date1, date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);

      // Set both dates to midnight (00:00:00) to ignore the time part
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);

      // Compare the two dates
      return d1.getTime() === d2.getTime();
    }



    payments.forEach(payment => {
      // console.log("Payment object:", payment);
      payment.products.forEach(product => {
        // console.log("Product object in payment:", product);
    // Compare dates without considering the time part
    // console.log("Checking for order_date " + product.order_date + " and productId " + productId + "  " + product.productId);
        if (areDatesEqual(product.order_date, order_date) && product.productId === productId) {
          totalAdults += product.adults_no || 0;
          totalKids += product.kids_no || 0;
          // console.log(totalAdults, totalKids);
        }
      });
    });

    const totalBookedPersons = totalAdults + totalKids;
    // console.log('Total booked persons  ' + totalBookedPersons );
    // Check if there is enough quantity for the selected number of guests
    if (product_Quantity < totalBookedPersons + total_persones) {

    // Redirect to the home page
      return res.redirect("/api/home");
    }

      const producte = {
        id: products._id,
        title: products.title,
        price: products.price,
        adultBaseprice: products.adultBaseprice,
        kidsBaseprice: products.kidsBaseprice,
        dayBaseprice: products.dayBaseprice,
        thumbnail: products.thumbnail,
      };
  
      const cartItem = {
        productId,
        adults_no,
        kids_no,
        check_in,
        check_out,
        days_count,
        total_no,
        totalCost,
        order_date,
        ...producte,
      };
  
      if (!req.session.cart) {
        req.session.cart = [];
      }
  
      // console.log("Cart before update:", req.session.cart);
  
      const itemIndex = req.session.cart.findIndex(item => item.productId === productId);
  
      if (itemIndex === -1) {
        // Add new item to cart
        req.session.cart.push(cartItem);
      } else {
        // Update existing item
        req.session.cart[itemIndex] = cartItem;
      }
  
      // console.log("Cart after update:", req.session.cart);
  
      // Render the cart
      res.render("cart", { cart: req.session.cart });
    } catch (error) {
      console.error("Error fetching product data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  

// ============ get personal function end ================

// ============== Module Exports ================

module.exports = {
    postpersonal,
    getpersonal
};