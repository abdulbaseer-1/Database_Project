import pool from '../database/db.js';
import getIdFromJWT from './getIdFromJWT.js';
export default (...allowedRoles) => {
  return async(req, res, next) => {

    const id = getIdFromJWT(req);

    const query = "SELECT role FROM users where id=?";
    const [rows] = await pool.query(query, [id]); // returns promise
    const role = rows[0]?.role;

    console.log("rows : ", rows[0]);
    console.log("role : ", role); //role :  Promise { <pending> }

    if (role !== "admin") {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};



/*
The issue lies in how you're handling the `pool.query()` function. Most database libraries return a `Promise` when making queries, so you need to await the resolution of this `Promise` properly.

### Problem

* The line `const role = await pool.query(query,[id]);` resolves to a `Promise`, but you're treating it as the resolved value directly.
* The `console.log` shows `Promise { <pending> }` because the query hasn't completed when you log `role`.

### Solution

#### 1. **Destructure the Result**

Depending on the database library you're using (e.g., `mysql2`, `pg`), the structure of the resolved value might differ. Typically, you'll receive rows as an array.

```javascript
const [rows] = await pool.query(query, [id]); // Adjust based on your library
const role = rows[0]?.role; // Extract the role
```

If you're using a library like `pg`, you might need:

```javascript
const result = await pool.query(query, [id]);
const role = result.rows[0]?.role;
```

#### 2. **Handle Missing or Invalid Roles**

Ensure the query returns a valid result:

```javascript
if (!role || !allowedRoles.includes(role)) {
  return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
}
```

#### Updated Code

Here’s the corrected middleware:

```javascript
import pool from '../database/db.js';
import getIdFromJWT from './getIdFromJWT.js';

export default (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const id = getIdFromJWT(req);

      // Query the database
      const [rows] = await pool.query("SELECT role FROM users WHERE id = ?", [id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const role = rows[0]?.role;

      // Check if the role is allowed
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next(); // Proceed to the next middleware
    } catch (error) {
      console.error('Error in role validation middleware:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};
```

### Explanation

1. **Database Query**:

   * The query fetches the user role based on their `id`.
   * Properly destructured `rows` ensures only the relevant data is extracted.

2. **Role Validation**:

   * Checks if the role exists in `allowedRoles`.

3. **Error Handling**:

   * Catches errors during database queries or validation, logging the error and responding with a `500` status.

### Next Steps

* Test with valid and invalid `id` values to ensure proper handling.
* Verify that `getIdFromJWT(req)` returns the correct `id`.
* Check that your database pool is configured correctly for queries.

*/