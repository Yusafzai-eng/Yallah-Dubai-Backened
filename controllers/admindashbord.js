
const Payment = require("../models/payment");
 const collection = require("../models/users");
const  Productes = require("../models/productes");
const fs = require('fs').promises;
// ============= admin get function Start ================

async function getadmin(req, res) {
   // Fetch all users data
   const users = await collection.find({ role: { $ne: 'admin' } });
 
   // Fetch all products data
   const products = await Productes.find();
 
 
   // Render admin page with fetched personal data
   const order = await Payment.find();
 
   // res.render("admin");
   res.json({ users, order, products });
   }
 
 // ============= admin get function end ================

 function  getadminproductadd(req, res){ 
  res.render('productdetail', { title: 'Product Detail' });
}


function  getadminproductupdate(req, res){
  res.render('editproduct', { title: 'Product Update' });

}


// controller/paymentController.js


async function getuserordersdetails(req, res) {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId in query." });
    }

    const userDetails = await Payment.find({ userId: userId });

    if (userDetails.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.status(200).json({ orders: userDetails });

  } catch (error) {
    console.error("❌ Error in getuserordersdetails:", error);
    res.status(500).send("Server Error");
  }
}

module.exports = { getuserordersdetails };

  
      

   const postproductcreat = async (req, res) => {
  try {
    const {
      cityName,
      citydescription,
      tourService,
      duration,
      transportService,
      pickUp,
      producttitle,
      discountPercentage,
      discountedtotal,
      price,
      prime,
      nonprime,
      privatetransferprice,
      quantity,
      productdescription,
      privatetransferperson,
      categorie,
      adultBaseprice,
      kidsBaseprice,
      translatelanguage,
      wifi,
    } = req.body;

    const cityImage = req.files['cityImage'] ? req.files['cityImage'][0].filename : null;
    const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'].map(file => file.filename) : [];

    if (
      !cityName || !citydescription || !cityImage || !tourService || !duration || !transportService || !pickUp ||
      !producttitle || !discountPercentage || !discountedtotal || !thumbnail || !price || !prime || !nonprime ||
      !privatetransferprice || !quantity || !productdescription || !privatetransferperson || !categorie ||
      !adultBaseprice || !kidsBaseprice || !translatelanguage || !wifi
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const product = await Productes.create({
      cityName,
      citydescription,
      cityImage,
      tourService,
      duration,
      transportService,
      pickUp,
      producttitle,
      discountPercentage,
      discountedtotal,
      thumbnail,
      price,
      prime,
      nonprime,
      privatetransferprice,
      quantity,
      productdescription,
      privatetransferperson,
      categorie,
      adultBaseprice,
      kidsBaseprice,
      translatelanguage,
      wifi,
    });

    // ✅ Always return success response as JSON
    return res.status(200).json({ msg: "Product created successfully", product });

  } catch (error) {
    console.error("❌ Backend Error:", error);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

      // backened code
// async function postproductcreat(req, res) {
//       try {
//         const { cityName, citydescription, tourService, duration, transportService, pickUp, producttitle, discountPercentage, discountedtotal,  price, prime, nonprime, privatetransferprice, quantity, productdescription, privatetransferperson, categorie, adultBaseprice, kidsBaseprice, translatelanguage, wifi } = req.body;
//         console.log(res.body)
//       const cityImage = req.files['cityImage'] ? req.files['cityImage'][0].filename : null;
//     const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'].map(file => file.filename) : [];

    
//         if (!cityName ||!citydescription ||!cityImage ||!tourService ||!duration ||!transportService ||!pickUp ||!producttitle ||!discountPercentage ||!discountedtotal ||!thumbnail ||!price ||!prime ||!nonprime ||!privatetransferprice ||!quantity ||!productdescription ||!privatetransferperson ||!categorie ||!adultBaseprice ||!kidsBaseprice ||!translatelanguage ||!wifi) {
//           return res.status(400).json({ msg: "All fields are required" });
//         }
    
    
//         const product = await Productes.create({
//           cityName,
//           citydescription,
//           cityImage, 
//           tourService, 
//           duration, 
//           transportService, 
//           pickUp, 
//           producttitle, 
//           discountPercentage, 
//           discountedtotal, 
//           thumbnail, 
//           price, 
//           prime, 
//           nonprime, 
//           privatetransferprice, 
//           quantity, 
//           productdescription, 
//           privatetransferperson,
//           categorie,
//           adultBaseprice,
//           kidsBaseprice,
//           translatelanguage,
//           wifi,
//         });
//         res.status(200);
//       } catch (error) {
//         console.error(error);
//         res.status(500).send("Server Error");
//       }
//     }



    async function getsingleproduct(req, res){
      try {
        const productID = req.query.id;
    
        const product = await Productes.findById(productID);
        if (!product) return res.status(404).send('The product with the given ID was not found.');
       return res.json({ product });
      } catch (error) {
        res.status(500).send(error.message);
      }
    }



function deleteproduct(req, res) {
  const productId = req.params.id; // ✅ Use params here
  console.log("Deleting ID:", productId); // 🔍 Debug log

  Productes.findByIdAndDelete(productId)
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    })
    .catch((error) => {
      console.error("Server error:", error);
      res.status(500).json({ message: "Server error" });
    });
}




              //  backened code
    //  function deleteproduct(req, res) {
    //   const productId = req.param.id;
    //   Productes.findByIdAndDelete(productId)
    //    .then(() => {
    //       res.status(200).json({ message: "Product deleted successfully" });
    //     })
    //    .catch((error) => {
    //       console.error(error);
    //       res.status(500).json({ message: "Server error" });
    //     });
    // }


   async function postproductupdate(req, res) {
  try {
    const productId = req.query._id;
    if (!productId) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    // Extract all fields from the form data
    const { 
      cityName, citydescription, tourService, duration, transportService, 
      pickUp, producttitle, discountPercentage, discountedtotal, price, 
      prime, nonprime, privatetransferprice, quantity, productdescription, 
      privatetransferperson, categorie, adultBaseprice, kidsBaseprice, 
      translatelanguage, wifi, existingCityImage, existingThumbnails
    } = req.body;

    let cityImage = req.body.cityImage || "";
    let thumbnail = req.body.thumbnail || [];

    // Handle file uploads
    if (req.files) {
      // Process city image
      if (req.files.cityImage) {
        cityImage = req.files.cityImage[0].filename;
      }

      // Process thumbnails
      if (req.files.thumbnail) {
        thumbnail = req.files.thumbnail.map(file => file.filename);
      }
    }

    // Delete old files if new ones are uploaded
    try {
      if (existingCityImage && req.files?.cityImage) {
        await fs.unlink(`./uploads/${existingCityImage}`);
      }

      if (existingThumbnails && req.files?.thumbnail) {
        for (const oldThumbnail of existingThumbnails) {
          await fs.unlink(`./uploads/${oldThumbnail}`);
        }
      }
    } catch (error) {
      console.error('Error deleting old files:', error);
    }

    const updateData = {
      cityName,
      citydescription,
      cityImage,
      tourService,
      duration,
      transportService,
      pickUp,
      producttitle,
      discountPercentage,
      discountedtotal,
      thumbnail,
      price,
      prime,
      nonprime,
      privatetransferprice,
      quantity,
      productdescription,
      privatetransferperson,
      categorie,
      adultBaseprice,
      kidsBaseprice,
      translatelanguage,
      wifi
    };

    const product = await Productes.findByIdAndUpdate(
      productId, 
      updateData, 
      { new: true }
    );

    res.status(200).json({ 
      message: "Product updated successfully", 
      product 
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
}

module.exports ={
    getuserordersdetails,
   getadmin,
   postproductcreat,
   getsingleproduct,
   deleteproduct,
   postproductupdate,
   getadminproductadd,
   getadminproductupdate
} ;