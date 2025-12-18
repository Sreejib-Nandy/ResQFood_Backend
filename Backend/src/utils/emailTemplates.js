export const foodClaimedOwnerTemplate = ({ food, ngo, restaurant }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
      
      <div style="background:#1e3a8a; color:#ffffff; padding:20px;">
        <h2>🌱 Your Food Donation Was Claimed!</h2>
      </div>

      <div style="padding:20px; color:#333;">
        <p>Hello <b>${restaurant.name}</b>,</p>

        <p>
          Great news! Your food donation has been successfully claimed by 
          <b>${ngo.name}</b>.
        </p>

        <div style="margin:20px 0; border-left:4px solid #22c55e; padding-left:15px;">
          <p><b>🍽 Food:</b> ${food.food_name}</p>
          <p><b>📦 Quantity:</b> ${food.quantity}</p>
          <p><b>⏰ Expiry:</b> ${new Date(food.expiry_time).toLocaleString()}</p>
        </div>

        <img 
          src="${food.food_image?.[0]?.url}" 
          alt="Food Image"
          style="width:100%; border-radius:8px; margin-top:10px;"
        />

        <p style="margin-top:20px;">
          Thank you for helping reduce food waste and support people in need.
          Your generosity truly makes a difference ❤️
        </p>

        <a
          href="https://www.google.com/maps?q=${food.location.coordinates[1]},${food.location.coordinates[0]}"
          style="display:inline-block; margin-top:15px; padding:10px 15px;
          background:#22c55e; color:#fff; text-decoration:none; border-radius:6px;">
          📍 View Pickup Location
        </a>
      </div>

      <div style="background:#f1f5f9; padding:15px; text-align:center; font-size:13px;">
        ResQFood — Saving Food, Serving Hope 🌍
      </div>
    </div>
  </div>
  `;
};


export const foodClaimedNgoTemplate = ({ food, restaurant }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px;">
      
      <div style="background:#16a34a; color:#ffffff; padding:20px;">
        <h2>🍽 Food Claimed Successfully!</h2>
      </div>

      <div style="padding:20px;">
        <p>Hello <b>Team</b>,</p>

        <p>
          You have successfully claimed the following food donation:
        </p>

        <ul>
          <li><b>Food:</b> ${food.food_name}</li>
          <li><b>Quantity:</b> ${food.quantity}</li>
          <li><b>Restaurant:</b> ${restaurant.name}</li>
          <li><b>Expiry:</b> ${new Date(food.expiry_time).toLocaleString()}</li>
        </ul>

        <img 
          src="${food.food_image?.[0]?.url}"
          style="width:100%; border-radius:8px; margin-top:10px;"
        />

        <p style="margin-top:20px;">
          Please collect the food before it expires. Your work helps fight hunger
          and reduce waste 💚
        </p>

        <a
          href="https://www.google.com/maps?q=${food.location.coordinates[1]},${food.location.coordinates[0]}"
          style="display:inline-block; margin-top:15px; padding:10px 15px;
          background:#16a34a; color:#fff; text-decoration:none; border-radius:6px;">
          📍 Navigate to Location
        </a>
      </div>

      <div style="background:#f1f5f9; padding:15px; text-align:center; font-size:13px;">
        Thank you for being a hero 🙏 — ResQFood
      </div>
    </div>
  </div>
  `;
};


export const foodCollectedNgoTemplate = ({ food, restaurant }) => {
  return `
  <div style="font-family: Arial; background:#f9fafb; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px;">
      <div style="background:#22c55e; color:#fff; padding:20px;">
        <h2>🌟 Food Collected Successfully</h2>
      </div>

      <div style="padding:20px;">
        <p>Thank you for collecting the food donation.</p>

        <p>
          <b>${food.food_name}</b> from <b>${restaurant.name}</b> has now been
          delivered to those in need.
        </p>

        <p>
          Your efforts are creating real impact in the community ❤️
        </p>
      </div>
    </div>
  </div>
  `;
};


export const foodCollectedOwnerTemplate = ({ food, ngo }) => {
  return `
  <div style="font-family: Arial; background:#f9fafb; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px;">
      <div style="background:#1e3a8a; color:#fff; padding:20px;">
        <h2>✅ Food Collected</h2>
      </div>

      <div style="padding:20px;">
        <p>Your food donation <b>${food.food_name}</b> has been collected by:</p>
        <p><b>${ngo.name}</b></p>

        <p>
          Thank you for your kindness and support. Together, we’re reducing food
          waste and helping people in need 🌍
        </p>
      </div>
    </div>
  </div>
  `;
};
