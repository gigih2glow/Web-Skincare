const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { Resend } = require('resend');

require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==============================
// KONEKSI DATABASE MYSQL
// ==============================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error('❌ Gagal terhubung ke MySQL:', err.message);
        return;
    }

    console.log('✅ Berhasil terhubung ke MySQL!');
});

// ==============================
// TEST BACKEND
// ==============================
// ===============================
// AMBIL DATA LEADERBOARD
// ===============================
app.get('/api/leaderboard', (req, res) => {
    const sql = `
        SELECT
            nama,
            MAX(level) AS level,
            MAX(waktu) AS waktu,
            MAX(last_seen) AS last_seen,
            CASE
                WHEN MAX(last_seen) >= NOW() - INTERVAL 10 SECOND
                THEN 'Online'
                ELSE 'Offline'
            END AS online_status
        FROM trivia_history
        WHERE status = 'LEVEL_UP'
        GROUP BY nama
        ORDER BY level DESC, waktu ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Gagal mengambil leaderboard:', err);

            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil leaderboard'
            });
        }

        res.json({
            success: true,
            players: results
        });
    });
});

// ==============================
// JALANKAN SERVER
// ==============================

// ===============================
// SIMPAN GAME OVER TRIVIA
// ===============================
app.post('/api/trivia/gameover', (req, res) => {
    const { nama, level } = req.body;

    if (!nama || !level) {
        return res.status(400).json({
            success: false,
            message: 'Nama dan level wajib diisi.'
        });
    }

    const sql = `
        INSERT INTO trivia_history (nama, level, status)
        VALUES (?, ?, 'GAME_OVER')
    `;

    db.query(sql, [nama, level], async (err, result) => {
        if (err) {
            console.error('❌ Gagal menyimpan Game Over:', err);

            return res.status(500).json({
                success: false,
                message: 'Gagal menyimpan Game Over ke database.'
            });
        }

        console.log(`💀 GAME OVER: ${nama} - Level ${level}`);

        // ===============================
        // KIRIM NOTIFIKASI EMAIL
        // ===============================
        try {
            const { error } = await resend.emails.send({
                from: 'Skincare Web <onboarding@resend.dev>',
                to: [process.env.EMAIL_TO],
                subject: `🎮 Game Over - ${nama}`,
                html: `
                    <div style="font-family:Arial,sans-serif;">
                        <h2>🎮 Trivia Skincare - Game Over</h2>

                        <p><strong>Nama:</strong> ${nama}</p>
                        <p><strong>Level terakhir:</strong> ${level}</p>
                        <p><strong>Status:</strong> GAME OVER</p>

                        <hr>
                        <small>
                            Notifikasi otomatis dari Skincare Web
                        </small>
                    </div>
                `
            });

            if (error) {
                console.error('❌ Email Game Over gagal:', error);
            } else {
                console.log('📩 Email Game Over terkirim:', nama);
            }

        } catch (emailError) {
            console.error('❌ Email Game Over error:', emailError);
        }

        res.json({
            success: true,
            message: 'Game Over berhasil disimpan!',
            id: result.insertId
        });
    });
});

// ===============================
// STATUS ONLINE PEMAIN
// ===============================
app.post('/api/heartbeat', (req, res) => {
    const { nama } = req.body;

    if (!nama) {
        return res.status(400).json({
            success: false,
            message: 'Nama pemain tidak ada.'
        });
    }

    const sql = `
        UPDATE trivia_history
        SET last_seen = CURRENT_TIMESTAMP
        WHERE nama = ?
    `;

    db.query(sql, [nama], (err) => {
        if (err) {
            console.error('❌ Gagal update status online:', err);

            return res.status(500).json({
                success: false
            });
        }

        res.json({
            success: true
        });
    });
});

// ===============================
// TEST EMAIL RESEND
// ===============================
app.get('/api/test-email', async (req, res) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Skincare Web <onboarding@resend.dev>',
            to: [process.env.EMAIL_TO],
            subject: '✨ Skincare Web berhasil terhubung!',
            html: `
                <div style="font-family:Arial,sans-serif;">
                    <h2>Skincare Web ✨</h2>
                    <p>Yey! Backend Node.js kamu berhasil mengirim email.</p>
                    <p>Berarti sistem notifikasi email sudah siap digunakan 🎉</p>
                </div>
            `
        });

        if (error) {
            console.error('❌ Resend error:', error);

            return res.status(400).json({
                success: false,
                error: error
            });
        }

        console.log('📩 Email tes berhasil dikirim!');

        res.json({
            success: true,
            message: 'Email tes berhasil dikirim!',
            id: data.id
        });

    } catch (error) {
        console.error('❌ Gagal mengirim email:', error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ===============================
// SIMPAN HASIL ANALISA + EMAIL
// ===============================
app.post('/api/analisa', (req, res) => {
    const {
        nama,
        jenis_kulit,
        permasalahan_kulit,
        rekomendasi_produk
    } = req.body;

    if (!nama) {
        return res.status(400).json({
            success: false,
            message: 'Nama wajib diisi.'
        });
    }

    const sql = `
        INSERT INTO analisa
        (nama, jenis_kulit, permasalahan_kulit, rekomendasi_produk)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nama, jenis_kulit, permasalahan_kulit, rekomendasi_produk],
        async (err, result) => {

            if (err) {
                console.error('❌ Gagal menyimpan analisa:', err);

                return res.status(500).json({
                    success: false,
                    message: 'Gagal menyimpan analisa.'
                });
            }

            console.log('✅ Analisa masuk:', nama);

            // Kirim notifikasi email
            try {
                const { error } = await resend.emails.send({
                    from: 'Skincare Web <onboarding@resend.dev>',
                    to: [process.env.EMAIL_TO],
                    subject: `✨ Hasil Analisa Baru - ${nama}`,
                    html: `
    <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        background: #FFF7F9;
        padding: 25px;
        border-radius: 16px;
        color: #444;
    ">

        <h2 style="
            color: #D81B60;
            text-align: center;
            margin-bottom: 5px;
        ">
            ✨ Hasil Analisa Kulit
        </h2>

        <p style="
            text-align: center;
            color: #888;
            font-size: 13px;
            margin-bottom: 25px;
        ">
            Ada hasil analisa baru dari Skincare Web
        </p>

        <div style="
            background: white;
            padding: 18px;
            border-radius: 12px;
            margin-bottom: 15px;
        ">
            <p>
                <strong>👤 Nama</strong><br>
                ${nama}
            </p>

            <p>
                <strong>🧴 Jenis Kulit</strong><br>
                ${jenis_kulit || '-'}
            </p>

            <p>
                <strong>🔍 Permasalahan Kulit</strong><br>
                ${permasalahan_kulit || '-'}
            </p>
        </div>

        <div style="
            background: white;
            padding: 18px;
            border-radius: 12px;
        ">
            <p style="
                color: #D81B60;
                font-weight: bold;
                margin-top: 0;
            ">
                💗 Rekomendasi Produk
            </p>

            ${rekomendasi_produk
                ? rekomendasi_produk
                    .split(' | ')
                    .map(produk => `
                        <div style="
                            background: #FFF0F3;
                            padding: 10px 12px;
                            border-radius: 8px;
                            margin-bottom: 7px;
                            font-size: 13px;
                        ">
                            ${produk}
                        </div>
                    `)
                    .join('')
                : '<p>-</p>'
            }
        </div>

        <p style="
            text-align: center;
            color: #aaa;
            font-size: 11px;
            margin-top: 20px;
        ">
            🕒 ${new Date().toLocaleString('id-ID', {
                timeZone: 'Asia/Jakarta'
            })}
            <br><br>
            Notifikasi otomatis dari Skincare Web
        </p>

    </div>
`
                });

                if (error) {
                    console.error('❌ Email analisa gagal:', error);
                } else {
                    console.log('📩 Email analisa terkirim:', nama);
                }

            } catch (emailError) {
                // Analisa tetap tersimpan walaupun email gagal
                console.error('❌ Email analisa error:', emailError);
            }

            res.json({
                success: true,
                message: 'Hasil analisa berhasil disimpan!',
                id: result.insertId
            });
        }
    );
});
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

// ===============================
// SIMPAN DATA TRIVIA
// ===============================
app.post('/api/leaderboard', (req, res) => {
    const { nama, level } = req.body;

    console.log('🎮 Data trivia masuk:', nama, level);

    const sql = `
        INSERT INTO trivia_history (nama, level)
        VALUES (?, ?)
    `;

    db.query(sql, [nama, level], async (err, result) => {
        if (err) {
            console.error('❌ Gagal menyimpan trivia ke MySQL:', err);

            return res.status(500).json({
                success: false,
                message: 'Gagal menyimpan trivia ke database'
            });
        }

        console.log('✅ Trivia berhasil masuk MySQL! ID:', result.insertId);

        // ===============================
        // EMAIL LEVEL BERHASIL
        // ===============================
        try {
            const { error } = await resend.emails.send({
                from: 'Skincare Web <onboarding@resend.dev>',
                to: [process.env.EMAIL_TO],
                subject: `🏆 Level ${level} Selesai - ${nama}`,
                html: `
                    <div style="font-family:Arial,sans-serif;">
                        <h2>🏆 Trivia Skincare</h2>

                        <p><strong>Nama:</strong> ${nama}</p>
                        <p><strong>Level:</strong> ${level}</p>
                        <p><strong>Status:</strong> Berhasil menyelesaikan Level ${level}</p>

                        <hr>
                        <small>
                            Notifikasi otomatis dari Skincare Web
                        </small>
                    </div>
                `
            });

            if (error) {
                console.error('❌ Email level gagal:', error);
            } else {
                console.log(`📩 Email Level ${level} terkirim: ${nama}`);
            }

        } catch (emailError) {
            console.error('❌ Email level error:', emailError);
        }

        res.json({
            success: true,
            message: 'Data trivia berhasil disimpan ke MySQL!',
            id: result.insertId
        });
    });
});