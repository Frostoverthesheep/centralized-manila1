import { Router } from 'express';
import conn2 from './connection.js';

const router = Router();

// //Profile Information
// app.get("/profile", (req, res)=>{
//   const q= "SELECT * FROM user_personal WHERE user_id = 'RL1741'"
//   conn2.query(q,(err, data)=>{
//           if(err) return res.json(err)
//           return res.json(data)
//   })
// })

router.get('/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    // SQL query to fetch the user's profile data
    const sql = "SELECT * FROM user_personal WHERE user_id = ?";

    conn2.query(sql, [user_id], (err, result) => {
        if (err) {
        console.error(err);
        res.status(500).send('Error retrieving data');
        } else {
        res.json(result);

        }
    });
    });


router.get('/contact/:user_id', (req, res) => {
      const user_id = req.params.user_id;
      
      const sql = "SELECT * FROM user_contact WHERE user_id = ?";
      
      conn2.query(sql, [user_id], (err, result) => {
          if (err) {
              console.error(err);
              res.status(500).send('Error retrieving contact info');
          } else {
              res.json(result);
              console.log(result)
          }
      });
  });

// Government ID
  router.get('/govinfo/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    const sql = "SELECT * FROM user_gov_id WHERE user_id = ?";
    conn2.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving government info');
        } else {
            res.json(result);
        }
    });
  });

  router.get('/rptaxpayment/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    const sql = "SELECT * FROM rp_tax WHERE user_id = ?";
    conn2.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving government info');
        } else {
            res.json(result);
        }
    });
  });


    router.put('/:user_id', (req, res) => {
        const user_id = req.params.user_id;
      
        const {
          f_name,
          m_name,
          l_name,
          suffix,
          sex_id,
          cvl_id,
        } = req.body;
        console.log(req.body);
        // Assuming you want to update the 'user_personal' table
        conn2.query(
          'UPDATE user_personal SET `f_name`=?, `m_name`=?, `l_name`=?, `suffix_id`=?, `sex_id`=?, `cvl_id`=? WHERE user_id=?',
          [f_name, m_name, l_name, suffix, sex_id, cvl_id, user_id],
          (error, results, fields) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.status(200).json({ message: 'Update successful' });
            }
          }
        );
      });

      router.put('/contact/:user_id', (req, res) => {
        const user_id = req.params.user_id;
      
        const {
          user_email,
          mobile_no,
          tel_no,
          user_municipal,
          user_brgy,
          user_dist,
          user_addr,
        } = req.body;
        console.log(req.body);
        // Assuming you want to update the 'user_personal' table
        conn2.query(
          'UPDATE user_contact SET `user_email`=?, `mobile_no`=?, `tel_no`=?, `user_municipal`=?, `user_brgy`=?, `user_dist`=?, `user_addr`=?  WHERE user_id=?',
          [user_email, mobile_no, tel_no, user_municipal, user_brgy, user_dist, user_addr, user_id],
          (error, results, fields) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.status(200).json({ message: 'Update successful' });
            }
          }
        );
      });

      router.put('/govinfo/:user_id', (req, res) => {
        const user_id = req.params.user_id;
      
        const {
          user_tin_id,
          user_pgb_id,
          user_philh_id,
          user_sss_id,
          user_gsis_id,
          user_natl_id,
        } = req.body;
        console.log(req.body);
        // Assuming you want to update the 'user_personal' table
        conn2.query(
          'UPDATE user_gov_id SET `user_tin_id`=?, `user_pgb_id`=?, `user_philh_id`=?, `user_sss_id`=?, `user_gsis_id`=?, `user_natl_id`=?  WHERE user_id=?',
          [user_tin_id, user_pgb_id, user_philh_id, user_sss_id, user_gsis_id, user_natl_id, user_id],
          (error, results, fields) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.status(200).json({ message: 'Update successful' });
            }
          }
        );
      });


      router.put('/rptaxpayment/:user_id', (req, res) => {
        const user_id = req.params.user_id;
        const {
          rp_tdn,
          rp_pin,
          rp_year,
          rp_period,
        } = req.body;
        console.log(req.body);
        conn2.query(
          'UPDATE rp_tax SET `rp_tdn`=?, `rp_pin`=?, `rp_year`=?, `rp_period`=? WHERE user_id=?',
          [rp_tdn, rp_pin, rp_year, rp_period, user_id],
          (error, results, fields) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.status(200).json({ message: 'Update successful' });
            }
          }
        );
      });



// // Contact Info
// router.get('/contact/:user_id', (req, res) => {
//     const user_id = req.params.user_id;
    
//     const sql = "SELECT * FROM user_contact WHERE user_id = ?";
    
//     conn2.query(sql, [user_id], (err, result) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Error retrieving contact info');
//         } else {
//             res.json(result);
//         }
//     });
// });

router.post('/rptaxpayment/', (req, res) => {
  const {
    acc_name,
    rp_tdn,
    rp_pin,
    rp_year,
    period,
  } = req.body;
  console.log(req.body);
  conn2.query(
    'INSERT INTO rp_tax ( `acc_name`, `rp_tdn`, `rp_pin`, `year`, `period`) VALUES (?, ?, ?, ?, ?)',
    [acc_name, rp_tdn, rp_pin, rp_year, period],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Update successful' });
      }
    }
  );
});


export default router;