// ==========================================
// 0. AUDIO ENGINE & BGM MP3 INTEGRATION
// ==========================================
const bgmAudio = new Audio('bgm.mp3'); 
bgmAudio.loop = true;
bgmAudio.volume = 0.6; 

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq1, freq2, type, duration) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.frequency.setValueAtTime(freq1, audioCtx.currentTime);
        if (freq2) osc.frequency.exponentialRampToValueAtTime(freq2, audioCtx.currentTime + duration);
        
        gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) { console.log(e); }
}

function playSFX(type) {
    initAudio();
    if (type === 'click') playTone(800, 800, 'sine', 0.05);
    else if (type === 'correct') playTone(600, 1200, 'sine', 0.25);
    else if (type === 'wrong') playTone(220, 110, 'sawtooth', 0.35);
    else if (type === 'countdown') playTone(440, 440, 'sine', 0.1);
    else if (type === 'levelUp') {
        playTone(440, 554.37, 'square', 0.15);
        setTimeout(() => playTone(659.25, 880, 'square', 0.35), 150);
    }
    else if (type === 'gameOver') playTone(300, 40, 'sawtooth', 0.6);
}

function stopBGM() {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
}

// Helper Shuffle Array
function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ==========================================
// 1. ARSIP DATABASE PRODUK LENGKAP
// ==========================================
const skincareDatabase = {
    "Facewash": [
        { img: "facewash1.jpg", nama: "Facewash Hanasui Pink", harga: "25rb", ukuran: "60ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "Advance Niacinamide, Genowhite, Mandelic Acid + MULTIVITAMIN", tekstur: "Cream", waktu: "Pagi dan Malam" },
        { img: "facewash2.jpg", nama: "Facewash Hanasui Hijau", harga: "25rb", ukuran: "60ml", cocok: ["kombinasi", "beruntusan", "berjerawat", "jerawat aktif"], ingredients: "Nano Salicylic Acid, Centella Asiatica, Panthenol + MULTIVITAMIN", tekstur: "Cream", waktu: "Pagi dan Malam" },
        { img: "facewash3.jpg", nama: "Facewash Hadalabo Putih Gokujyun", harga: "42rb", ukuran: "100ml", cocok: ["kering", "sangat kering"], ingredients: "2 Tipe Hyaluronic Acid", tekstur: "Cream", waktu: "Pagi dan Malam" },
        { img: "facewash4.jpg", nama: "Facewash Hadalabo Biru Shirojyun", harga: "42rb", ukuran: "100ml", cocok: ["kering", "sangat kering", "bekas jerawat", "kusam"], ingredients: "2 Tipe Hyaluronic Acid, Alpha Arbutin dan Vitamin C", tekstur: "Cream", waktu: "Pagi dan Malam" },
        { img: "facewash5.jpg", nama: "Facewash Y.O.U Hijau", harga: "36rb", ukuran: "100ml", cocok: ["berminyak", "sangat berminyak", "berjerawat", "jerawat aktif", "beruntusan", "kemerahan", "pori pori"], ingredients: "1,5% Salicylic Acid dan Amino Acid", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "facewash6.jpg", nama: "Facewash Glamazing Hijau", harga: "36rb", ukuran: "100ml", cocok: ["berminyak", "sangat berminyak", "berjerawat", "jerawat aktif", "beruntusan", "sensitif", "kemerahan", "pori pori"], ingredients: "1% Salicylic Acid dan Panthenol", tekstur: "Gel", waktu: "Pagi dan Malam" },
        { img: "facewash7.jpg", nama: "Facewash Glad2Glow Hijau", harga: "36rb", ukuran: "70ml", cocok: ["berminyak", "beruntusan", "berjerawat", "jerawat aktif"], ingredients: "Salicylic Acid dan Centella", tekstur: "Gel", waktu: "Pagi dan Malam" }
    ],
    "Toner": [
        { img: "toner1.jpg", nama: "Toner Hanasui Pink", harga: "30rb", ukuran: "105ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "Advance Niacinamide, Genowhite, Mandelic Acid, 8 Hyaluronate + MULTIVITAMIN", tekstur: "Watery", waktu: "Pagi dan Malam" },
        { img: "toner2.jpg", nama: "Toner Autumn Ungu", harga: "50rb", ukuran: "500ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "5% Niacinamide, Vitamin C, Alpha Arbutin, Tranexamic Acid dan 7x Hyaluronic Complex", tekstur: "Watery", waktu: "Pagi dan Malam" },
        { img: "toner3.jpg", nama: "Toner Autumn Hijau", harga: "60rb", ukuran: "500ml", cocok: ["kombinasi", "berminyak", "berjerawat", "jerawat aktif", "beruntusan"], ingredients: "Salicylic Acid dan Centella Asiatica", tekstur: "Watery", waktu: "Malam" }
    ],
    "Serum": [
        { img: "serum1.jpg", nama: "Serum Hanasui Brightening", harga: "30rb", ukuran: "20ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "10% Advanced Niacinamide", tekstur: "Agak Kental", waktu: "Pagi dan Malam (Dianjurkan Pagi)" },
        { img: "serum2.jpg", nama: "Serum Hanasui Acne", harga: "25rb", ukuran: "20ml", cocok: ["berminyak", "kusam", "berjerawat", "jerawat aktif", "beruntusan", "pori pori"], ingredients: "0,5% Salicylic Acid, Centella Asiatica dan 2% Niacinamide", tekstur: "Agak Kental", waktu: "Malam" },
        { img: "serum3.jpg", nama: "Serum Hanasui Bakuchiol", harga: "30rb", ukuran: "20ml", cocok: ["kering", "sangat kering", "anti aging"], ingredients: "Bakuchiol", tekstur: "Kental", waktu: "Pagi dan Malam" },
        { img: "serum4.jpg", nama: "Serum Hanasui MiniPore", harga: "30rb", ukuran: "20ml", cocok: ["berminyak", "pori pori"], ingredients: "NanoActive Salicylic Acid dan Japan Panadoxine", tekstur: "Agak Kental", waktu: "Malam" },
        { img: "serum5.jpg", nama: "Serum Somethinc Pink", harga: "120rb", ukuran: "20ml", cocok: ["berminyak", "sangat berminyak", "beruntusan", "berjerawat", "jerawat aktif", "komedo", "pori pori"], ingredients: "2% Salicylic Acid", tekstur: "Watery", waktu: "Malam" },
        { img: "serum6.jpg", nama: "Serum Somethinc Propolis", harga: "120rb", ukuran: "20ml", cocok: ["kering", "sangat kering", "skin barrier rusak", "anti aging"], ingredients: "60% Korean Propolis, Sweden Bee Venom dan Manuka Honey", tekstur: "Kental", waktu: "Pagi dan Malam (Dianjurkan Pagi)" },
        { img: "serum7.jpg", nama: "Serum Skin1004 Brightening", harga: "250rb", ukuran: "100ml", cocok: ["kombinasi", "kusam", "bekas jerawat"], ingredients: "Niacinamide dan Centella Asiatica", tekstur: "Agak Kental", waktu: "Pagi dan Malam (Dianjurkan Pagi)" }
    ],
    "Moisturizer": [
        { img: "moist1.jpg", nama: "Moisturizer Hanasui Hijau", harga: "38rb", ukuran: "30ml", cocok: ["kering", "skin barrier rusak", "kemerahan", "sensitif", "mencerahkan"], ingredients: "5x Ceramide, Niacinamide dan Hyaluronic Acid", tekstur: "Gel Cream", waktu: "Pagi dan Malam" },
        { img: "moist2.jpg", nama: "Moisturizer Hanasui Orange", harga: "38rb", ukuran: "30ml", cocok: ["kering", "skin barrier rusak", "mencerahkan", "bekas jerawat", "kusam"], ingredients: "5x Ceramide, 5% Niacinamide dan Tranexamic Acid", tekstur: "Gel", waktu: "Pagi dan Malam" }
    ],
    "Sunscreen": [
        { img: "sunscreen1.jpg", nama: "Sunscreen Hanasui SPF 30 PA+++", harga: "28rb", ukuran: "30ml", cocok: ["kombinasi", "kering"], ingredients: "Chemical UV Filters (Finish Glowing)", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen2.jpg", nama: "Sunscreen Hanasui SPF 50 PA++++", harga: "38rb", ukuran: "30ml", cocok: ["kombinasi", "kering"], ingredients: "Chemical UV Filters (Finish Glowing)", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen3.jpg", nama: "Sunscreen Glamazing SPF 50 PA+++", harga: "60rb", ukuran: "50ml", cocok: ["kering", "sangat kering"], ingredients: "Physical UV Filters (Finish Matte)", tekstur: "Cream", waktu: "Pagi" },
        { img: "sunscreen4.jpg", nama: "Sunscreen Madam Gie SPF 35 PA+++", harga: "38rb", ukuran: "50ml", cocok: ["kombinasi"], ingredients: "Hybrid UV Filters (Finish Glowing)", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen5.jpg", nama: "Sunscreen Acnaway SPF 35 PA+++", harga: "40rb", ukuran: "30ml", cocok: ["berminyak", "sangat berminyak", "berjerawat", "beruntusan"], ingredients: "Chemical UV Filters (Finish Matte)", tekstur: "Gel", waktu: "Pagi" },
        { img: "sunscreen6.jpg", nama: "Sunscreen El formula SPF 50 PA+++", harga: "70rb", ukuran: "50ml", cocok: ["kombinasi", "berminyak"], ingredients: "Hybrid UV Filters (Finish Matte)", tekstur: "Watery", waktu: "Pagi" }
    ]
};

// ==========================================
// 2. KAMUS INGREDIENTS
// ==========================================
const kamusData = {
    "Jerawat & Beruntusan": [
        { nama: "Salicylic Acid (BHA)", fungsi: "Membersihkan pori tersumbat, eksfoliasi minyak, meredakan radang.", takaran: "0.5% - 2%", cocokDi: "Serum / Exfoliating Toner / Facewash" },
        { nama: "Centella Asiatica", fungsi: "Menenangkan kemerahan, iritasi, dan mempercepat pemulihan jerawat.", takaran: "Pure Extract", cocokDi: "Serum / Moisturizer" },
        { nama: "Sulfur (Belerang)", fungsi: "Mengeringkan jerawat aktif dengan cepat dan menyerap kelebihan sebum.", takaran: "1% - 5%", cocokDi: "Spot Treatment" },
        { nama: "Tea Tree Oil", fungsi: "Antimikroba alami untuk melawan bakteri penyebab jerawat.", takaran: "0.5% - 1%", cocokDi: "Spot Treatment" },
        { nama: "Benzoyl Peroxide", fungsi: "Membunuh bakteri P. acnes langsung di sumber jerawat meradang.", takaran: "2.5% - 5%", cocokDi: "Spot Treatment" }
    ],
    "Kulit Berminyak & Pori": [
        { nama: "Salicylic Acid (BHA)", fungsi: "Membersihkan pori tersumbat, eksfoliasi minyak, meredakan radang.", takaran: "0.5% - 2%", cocokDi: "Serum / Toner / Facewash" },
        { nama: "Niacinamide", fungsi: "Mengatur produksi minyak dan menyamarkan tampilan pori besar.", takaran: "2% - 10%", cocokDi: "Serum" },
        { nama: "Zinc PCA", fungsi: "Menyeimbangkan sebum dan mengurangi kilap berlebih di wajah.", takaran: "0.5% - 1%", cocokDi: "Serum / Toner" },
        { nama: "Green Tea Extract", fungsi: "Antioksidan mengontrol kilap minyak dan menenangkan kulit.", takaran: "1% - 3%", cocokDi: "Toner" },
        { nama: "Witch Hazel", fungsi: "Pengecil pori alami dan menyegarkan kulit berminyak.", takaran: "1% - 5%", cocokDi: "Toner" }
    ],
    "Kusam & Bekas Jerawat": [
        { nama: "Niacinamide", fungsi: "Mencerahkan kulit kusam, menyamarkan noda hitam, meratakan warna kulit.", takaran: "2% - 10%", cocokDi: "Serum" },
        { nama: "Alpha Arbutin", fungsi: "Menghambat enzim tyrosinase memudarkan bekas jerawat kehitaman.", takaran: "1% - 2%", cocokDi: "Serum" },
        { nama: "Vitamin C", fungsi: "Antioksidan tinggi mencerahkan dan memberi efek glowing seketika.", takaran: "5% - 15%", cocokDi: "Serum" },
        { nama: "Tranexamic Acid", fungsi: "Menghambat pembentukan pigmen gelap akibat bekas jerawat membandel.", takaran: "2% - 5%", cocokDi: "Serum" },
        { nama: "Kojic Acid", fungsi: "Mencerahkan warna kulit tidak merata.", takaran: "1% - 2%", cocokDi: "Serum" }
    ],
    "Skin Barrier & Sensitif": [
        { nama: "Ceramide", fungsi: "Memperbaiki dan memperkuat lapisan pelindung kulit (skin barrier).", takaran: "Kompleks 3x-5x", cocokDi: "Moisturizer / Facewash" },
        { nama: "Panthenol (Pro-Vitamin B5)", fungsi: "Menghidrasi mendalam dan menenangkan kulit reaktif/iritasi.", takaran: "1% - 5%", cocokDi: "Moisturizer / Toner" },
        { nama: "Allantoin", fungsi: "Mendinginkan kulit meradang, kemerahan, atau kasar.", takaran: "0.1% - 0.5%", cocokDi: "Gel / Moisturizer" },
        { nama: "Beta-Glucan", fungsi: "Menghidrasi dan menenangkan kulit sensitif lebih baik dari HA.", takaran: "0.1% - 1%", cocokDi: "Serum" },
        { nama: "Colloidal Oatmeal", fungsi: "Meredakan gatal dan kemerahan pada kulit sangat sensitif.", takaran: "1% - 2%", cocokDi: "Cream" }
    ],
    "Kulit Sangat Kering": [
        { nama: "Hyaluronic Acid", fungsi: "Menarik kelembapan dari udara ke dalam sel kulit.", takaran: "1% - 2%", cocokDi: "Toner / Serum" },
        { nama: "Glycerin", fungsi: "Humektan klasik penjaga kelembutan kulit.", takaran: "2% - 5%", cocokDi: "Moisturizer" },
        { nama: "Squalane", fungsi: "Mengunci hidrasi alami tanpa menyumbat pori.", takaran: "Pure / 5%", cocokDi: "Facial Oil" },
        { nama: "Shea Butter", fungsi: "Menutrisi mendalam kulit kering pecah-pecah.", takaran: "2% - 10%", cocokDi: "Rich Cream" },
        { nama: "Urea", fungsi: "Melembutkan sel kulit mati yang mengeras akibat kekeringan.", takaran: "5% - 10%", cocokDi: "Lotion" }
    ],
    "Anti-Aging & Tekstur": [
        { nama: "Retinol", fungsi: "Merangsang regenerasi sel dan menyamarkan garis halus.", takaran: "0.1% - 1%", cocokDi: "Night Serum" },
        { nama: "Bakuchiol", fungsi: "Alternatif retinol nabati yang aman untuk kulit sensitif/bumil.", takaran: "1% - 2%", cocokDi: "Serum" },
        { nama: "Glycolic Acid (AHA)", fungsi: "Eksfoliasi permukaan kulit untuk menghaluskan tekstur kasar.", takaran: "5% - 10%", cocokDi: "Exfoliating Toner" },
        { nama: "Peptides", fungsi: "Mendukung produksi kolagen agar kulit tetap kencang.", takaran: "1% - 5%", cocokDi: "Serum / Moisturizer" },
        { nama: "Lactic Acid (AHA)", fungsi: "Eksfoliasi lembut sekaligus melembabkan kulit.", takaran: "5% - 10%", cocokDi: "Toner" }
    ]
};

// ==========================================
// 3. NAVIGASI & POP-UP
// ==========================================
function switchScreen(screenId) {
    stopBGM();
    clearInterval(triviaState.timer); 
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'home-screen') renderHomeBadges();
    if (screenId === 'analisa-screen') initAnalisa();
    if (screenId === 'kamus-screen') initKamus();
    if (screenId === 'trivia-screen') initTrivia();
    if (screenId === 'leaderboard-screen') initLeaderboard();
}

function renderHomeBadges() {
    const unlockedLevel = parseInt(localStorage.getItem('skincare_unlocked_level') || 0);
    const badgeContainer = document.getElementById('home-badge-container');
    if (!badgeContainer) return;

    let badgesHTML = '<h3 style="font-size: 14px; color: #D81B60; margin-bottom: 8px;">Koleksi Badge Kamu:</h3><div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">';
    let hasBadge = false;

    if (unlockedLevel >= 1) { badgesHTML += `<span style="background: #E0F7FA; color: #00796B; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: bold;">Rookie</span>`; hasBadge = true; }
    if (unlockedLevel >= 2) { badgesHTML += `<span style="background: #FFF9C4; color: #F57F17; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: bold;">Middle</span>`; hasBadge = true; }
    if (unlockedLevel >= 3) { badgesHTML += `<span style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #fff; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: bold;">Expert</span>`; hasBadge = true; }

    if (!hasBadge) badgesHTML += `<span style="color: #888; font-size: 12px; font-style: italic;">Kamu belum mendapatkan Badge, selesaikan Trivia Skincare terlebih dahulu!</span>`;
    badgeContainer.innerHTML = badgesHTML + '</div>';
}

function checkUpdatePopup() {
    const modal = document.createElement('div');
    modal.id = 'update-modal';
    modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:9999;";
    modal.innerHTML = `
        <div style="background:white; padding:20px; border-radius:15px; width:85%; max-width:320px; text-align:center;">
            <h3 style="color:#D81B60; margin-bottom:10px;">Update Terbaru Web</h3>
            <p style="font-size:12px; color:#555; text-align:left; line-height:1.5; margin-bottom:15px;">
                - Tampilan web baru yang lebih fresh.<br>
                - Update baru trivia game dengan soal yang lebih menantang.<br>
                - Fitur baru leaderboard online pemain.
            </p>
            <div style="background:#FFF0F3; padding:10px; border-radius:8px; font-size:11px; color:#D81B60; margin-bottom:15px;">
                <strong>Open Donasi E-Wallet:</strong><br><strong style="font-size:14px;">085640743667</strong>
            </div>
            <div style="display:flex; justify-content:center;">
                <button class="menu-btn" style="padding: 10px 30px;" onclick="document.getElementById('update-modal').remove();">Lanjut</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ==========================================
// 4. ANALISA KULIT
// ==========================================
let analisaData = { nama: '', skinType: '', problems: [], budget: '' };

function initAnalisa() { 
    analisaData = { nama: '', skinType: '', problems: [], budget: '' };
    renderAnalisaStep(1); 
}

function renderAnalisaStep(step) {
    const container = document.getElementById('analisa-container');
    if (step === 1) {
        container.innerHTML = `
            <p style="font-size:12px; color:#888; margin-bottom:15px;">Langkah 1: Data Diri</p>
            <p style="text-align:left; font-size:13px;">Masukkan nama kamu sebelum memulai analisa:</p>
            <input type="text" id="user-name" class="form-input" placeholder="Ketik nama kamu di sini...">
            <div style="display:flex; justify-content:center;"><button class="menu-btn" onclick="saveName()">Lanjut</button></div>
        `;
    } else if (step === 2) {
        container.innerHTML = `
            <p style="font-size:12px; color:#888; margin-bottom:15px;">Langkah 2: Tipe Kulit</p>
            <p style="text-align:left; font-size:13px;">Halo <strong>${analisaData.nama}</strong>, pilih tipe kulit kamu:</p>
            <div class="menu-container">
                <button class="menu-btn" onclick="saveSkinType('Kering')">Kering</button>
                <button class="menu-btn" onclick="saveSkinType('Berminyak')">Berminyak</button>
                <button class="menu-btn" onclick="saveSkinType('Kombinasi')">Kombinasi</button>
            </div>
        `;
    } else if (step === 3) {
        container.innerHTML = `
            <p style="font-size:12px; color:#888; margin-bottom:15px;">Langkah 3: Permasalahan Kulit</p>
            <div class="quiz-checkbox-grid" style="max-height: 200px; overflow-y: auto; text-align:left;">
                <label style="padding:8px; background:#FFF0F3; border-radius:8px; display:block; margin-bottom:6px;"><input type="checkbox" value="Jerawat Aktif"> Jerawat Aktif</label>
                <label style="padding:8px; background:#FFF0F3; border-radius:8px; display:block; margin-bottom:6px;"><input type="checkbox" value="Beruntusan"> Beruntusan</label>
                <label style="padding:8px; background:#FFF0F3; border-radius:8px; display:block; margin-bottom:6px;"><input type="checkbox" value="Bekas Jerawat"> Bekas Jerawat</label>
                <label style="padding:8px; background:#FFF0F3; border-radius:8px; display:block; margin-bottom:6px;"><input type="checkbox" value="Kulit Kusam"> Kulit Kusam</label>
                <label style="padding:8px; background:#FFF0F3; border-radius:8px; display:block; margin-bottom:6px;"><input type="checkbox" value="Skin Barrier Rusak"> Skin Barrier Rusak</label>
                <label style="padding:8px; background:#FFF0F3; border-radius:8px; display:block; margin-bottom:6px;"><input type="checkbox" value="Pori Pori"> Pori Pori</label>
                <label style="padding:8px; background:#FFF0F3; border-radius:8px; display:block; margin-bottom:6px;"><input type="checkbox" value="Kemerahan"> Kemerahan / Sensitif</label>
            </div>
            <div style="display:flex; justify-content:center; margin-top:15px;"><button class="menu-btn" onclick="saveProblems()">Lanjut</button></div>
        `;
    } else if (step === 4) {
        showAnalisaResult();
    }
}

function saveName() { 
    const val = document.getElementById('user-name').value;
    if(val) { analisaData.nama = val; renderAnalisaStep(2); } 
    else alert("Isi nama dulu dong!"); 
}
function saveSkinType(t) { analisaData.skinType = t; renderAnalisaStep(3); }
function saveProblems() { 
    analisaData.problems = Array.from(document.querySelectorAll('#analisa-container input:checked')).map(cb => cb.value);
    renderAnalisaStep(4); 
}

function getBestProduct(category, userType, userProblems) {
    const list = skincareDatabase[category];
    let bestProduct = list[0];
    let maxScore = -1;

    list.forEach(prod => {
        let score = 0;
        const prodTags = prod.cocok.map(c => c.toLowerCase());
        if (prodTags.includes(userType.toLowerCase())) score += 3;
        userProblems.forEach(prob => {
            let pLow = prob.toLowerCase();
            if (pLow.includes("jerawat")) pLow = "berjerawat";
            if (pLow.includes("kusam")) pLow = "kusam";
            if (pLow.includes("sensitif") || pLow.includes("kemerahan")) pLow = "sensitif";
            if (prodTags.some(t => t.includes(pLow) || pLow.includes(t))) score += 2;
        });
        if (score > maxScore) { maxScore = score; bestProduct = prod; }
    });
    return bestProduct;
}

function showAnalisaResult() {
    const container = document.getElementById('analisa-container');
    const fw = getBestProduct("Facewash", analisaData.skinType, analisaData.problems);
    const toner = getBestProduct("Toner", analisaData.skinType, analisaData.problems);
    const serum = getBestProduct("Serum", analisaData.skinType, analisaData.problems);
    const moist = getBestProduct("Moisturizer", analisaData.skinType, analisaData.problems);
    const sunscreen = getBestProduct("Sunscreen", analisaData.skinType, analisaData.problems);
    const paketItems = [fw, toner, serum, moist, sunscreen];

    let itemsHTML = paketItems.map(item => `
        <div style="background: #FFF0F3; border: 1px solid #F8BBD0; border-radius: 12px; padding: 10px; display: flex; align-items: center; gap: 12px; margin-bottom: 10px; text-align: left;">
            <img src="${item.img}" style="width: 55px; height: 75px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/55x75?text=No+Img'">
            <div>
                <h4 style="margin: 0; color: #D81B60; font-size: 13px;">${item.nama}</h4>
                <p style="margin: 2px 0; font-size: 11px;"><strong>Harga:</strong> ${item.harga} (${item.ukuran}) | <strong>Tekstur:</strong> ${item.tekstur}</p>
                <p style="margin: 2px 0; font-size: 11px; color:#D81B60;"><strong>Main Ingredients:</strong> ${item.ingredients}</p>
                <p style="margin: 2px 0 0 0; font-size: 10px; color: #555;"><strong>Waktu Pakai:</strong> ${item.waktu}</p>
            </div>
        </div>
    `).join('');

    const problemsText = analisaData.problems.length > 0 ? analisaData.problems.join(', ') : 'Umum';

    container.innerHTML = `
        <p style="font-size:14px; font-weight:bold; color:#D81B60; margin-bottom:4px;">Hasil Analisa Kulit ${analisaData.nama}</p>
        <p style="font-size:11px; color:#555; text-align:left; margin-bottom:10px;">Diracik khusus untuk tipe kulit <strong>${analisaData.skinType}</strong> dengan keluhan <strong>${problemsText}</strong>:</p>
        <div style="max-height: 300px; overflow-y: auto; padding-right: 4px; margin-bottom: 12px;">${itemsHTML}</div>
        <div style="display:flex; justify-content:center;"><button class="menu-btn" style="background:#78909C; padding:10px 20px;" onclick="switchScreen('home-screen')">Selesai & Kembali</button></div>
    `;
}

function initKamus() {
    const btnBox = document.getElementById('kamus-problem-buttons');
    const list = document.getElementById('ingredients-list');
    btnBox.innerHTML = ''; 
    list.innerHTML = '<p style="text-align:center; color:#888; font-style:italic; margin-top:20px;">Silahkan pilih salah satu kategori di atas untuk melihat daftar ingredients.</p>';
    
    Object.keys(kamusData).forEach(prob => {
        const btn = document.createElement('button');
        btn.className = 'menu-btn'; 
        btn.style.cssText = "padding: 10px; font-size: 13px; background: #FFD1DC; color: #D81B60; border: 1px solid #F8BBD0;";
        btn.innerText = prob;
        
        btn.onclick = () => {
            document.querySelectorAll('#kamus-problem-buttons .menu-btn').forEach(b => { b.style.background = '#FFD1DC'; b.style.border = '1px solid #F8BBD0'; b.style.fontWeight = 'normal'; });
            btn.style.background = '#F8BBD0'; btn.style.border = '2px solid #D81B60'; btn.style.fontWeight = 'bold';
            list.innerHTML = '';
            kamusData[prob].forEach(i => {
                const card = document.createElement('div');
                card.className = 'ing-card';
                card.style.cssText = "background: #FFF0F3; border: 1px solid #F8BBD0; border-radius: 10px; padding: 12px; margin-bottom: 8px; cursor: pointer;";
                card.innerHTML = `<strong style="color:#D81B60; font-size:14px;">${i.nama}</strong><br><span style="font-size:11px; color:#555;">${i.fungsi}</span>`;
                card.onclick = () => openIngModal(i);
                list.appendChild(card);
            });
        };
        btnBox.appendChild(btn);
    });
}

function openIngModal(item) {
    document.getElementById('modal-details').innerHTML = `
        <h3 style="color:#D81B60; margin-bottom:8px;">${item.nama}</h3>
        <p style="margin-bottom:6px;"><strong>Fungsi Utama:</strong> ${item.fungsi}</p>
        <p style="margin-bottom:6px;"><strong>Spesifikasi / Persentase Aman:</strong> ${item.takaran}</p>
        <p style="margin-bottom:0;"><strong>Format Produk Terbaik:</strong> ${item.cocokDi}</p>
    `;
    document.getElementById('app-modal').style.display = 'flex';
}

// ==========================================
// 5. TRIVIA GAME ENGINE
// ==========================================

const bankSoalL1 = [
    { q: "Apa fungsi utama dari Salicylic Acid?", opt: ["Mengeringkan jerawat", "Melemebabkan kulit", "Menaikkan skin tone", "Membuat kulit jadi glowing"], a: 0 },
    { q: "Ingredients apa yang ampuh memudarkan bekas jerawat kehitaman?", opt: ["Petroleum Jelly", "Alpha Arbutin", "Sulfur murni", "Alkohol berat"], a: 1 },
    { q: "Ingredients apa yang menjadi kunci utama memperbaiki skin barrier?", opt: ["Scrub kasar", "Alkohol", "Ceramide", "Parfum sintetis"], a: 2 },
    { q: "Tekstur Moisturizer apa yang paling cocok dan lebih di rekomendasikan untuk kulit sangat kering?", opt: ["Bebas apa saja", "Watery", "Gel", "Cream"], a: 3 },
    { q: "Ingredients alternatif Retinol yang aman untuk bumil adalah...", opt: ["Benzoyl Peroxide", "Bakuchiol", "Glycolic Acid", "Salicylic Acid murni"], a: 1 },
    { q: "Morning Routin Skincare di pagi hari setelah cuci muka yang paling tepat adalah...", opt: ["Sunscreen -> Moisturizer -> Serum", "Toner -> Serum -> Moisturizer -> Sunscreen", "Moisturizer -> Toner -> Sunscreen", "Serum -> Sunscreen -> Toner"], a: 1 },
    { q: "Berapa kali idealnya melakukan eksfoliasi dalam seminggu?", opt: ["Setiap hari pagi malam", "7 kali seminggu", "1-2 kali seminggu", "Sebulan sekali"], a: 2 },
    { q: "Kapan waktu terbaik memakai Exfoliating Toner?", opt: ["Pagi hari sebelum berjemur", "Siang bolong", "Malam hari", "Setiap mau makan"], a: 2 },
    { q: "Apa fungsi utama Ingredient Hyaluronic Acid?", opt: ["Menghidrasi kelembapan & menghidrasi kulit", "Mengangkat kulit mati", "Mengeringkan jerawat berlebih", "Membunuh bakteri jerawat"], a: 0 },
    { q: "Zat apa yang berfungsi mengontrol minyak dan menyamarkan pori?", opt: ["Coconut Oil", "Niacinamide", "Vaseline", "Olive Oil"], a: 1 },
    { q: "Berapa lama waktu ideal mendiamkan sheet mask di wajah?", opt: ["Semalaman sampai kering", "15-20 menit saja", "1 jam penuh", "5 detik saja"], a: 1 },
    { q: "Apakah vitamin yang berfungsi sebagai antioksidan kuat pencerah kulit?", opt: ["Vitamin C", "Vitamin B12", "Vitamin K", "Vitamin D"], a: 0 },
    { q: "Apa akibat jika kulit berminyak diskip penggunaan moisturizernya?", opt: ["Kulit jadi sangat sehat", "Produksi minyak makin menggila / rebound oil", "Pori-pori mengecil otomatis", "Bekas jerawat menghilang"], a: 1 },
    { q: "Apa nama proses penyesuaian kulit saat awal memakai retinol/exfoliator di mana muncul jerawat kecil sementara?", opt: ["Skin peeling", "Breaking water", "Allergic break", "Purging"], a: 3 },
    { q: "Manakah jenis sunscreen yang bekerja memantulkan sinar UV seperti cermin?", opt: ["Chemical sunscreen", "Physical / Mineral sunscreen", "Hybrid moisturizer", "Gel sunscreen"], a: 1 },
    { q: "Bagaimana cara mencuci muka yang benar untuk kulit berjerawat?", opt: ["Digosok sekencang-kencangnya pakai handuk kasar", "Dipijat lembut dengan ujung jari menggunakan gentle cleanser", "Disiram air panas mendidih 40°", "Dibiarkan tanpa dibilas"], a: 1 },
    { q: "Apakah fungsi Centella Asiatica dalam skincare?", opt: ["Menenangkan kemerahan dan iritasi", "Memutihkan kulit secara instan", "Menghilangkan sel kulit mati", "Memberi warna glowing permanen"], a: 0 },
    { q: "Ingredients apa yang dikenal bagus untuk merawat kulit kusam dan meratakan warna kulit?", opt: ["Alkohol", "Sulfur", "Petrolatum", "Alpha Arbutin"], a: 3 },
    { q: "Kapan waktu wajib re-apply sunscreen saat beraktivitas di luar ruangan?", opt: ["Setiap 2-3 jam sekali", "Sekali sehari saja", "Seminggu sekali", "Setiap 10 menit"], a: 0 },
    { q: "Apa ciri utama jika skin barrier wajah kamu rusak?", opt: ["Kulit menjadi kusam walau sudah menggunakan tone up", "Kulit terasa perih, kemerahan, dan gampang jerawatan", "Pori-pori membesar dan sangat berminyak", "Kulit menjadi sangat kering dan tipis"], a: 1 },
    { q: "Ingredients mana yang ampuh menyerap minyak berlebih & mengeringkan jerawat?", opt: ["Hyaluronic Acid", "Shea Butter", "Glycerin", "Sulfur"], a: 3 },
    { q: "Jenis sunscreen yang tidak meninggalkan (whitecast) adalah...", opt: ["Chemical Sunscreen", "Physical Sunscreen", "Mineral Sunscreen", "Sunblock"], a: 0 },
    { q: "Ingredients eksfoliasi lembut yang cocok untuk kulit kering adalah...", opt: ["Lactic Acid", "High Concentrate BHA", "Benzoyl Peroxide", "Retinol"], a: 0 },
    { q: "Ingredients yang berfungsi mengunci kelembapan tanpa menyumbat pori adalah...", opt: ["Coconut Oil", "Squalane", "Mineral Oil", "Beeswax"], a: 1 },
    { q: "Tranexamic Acid sangat efektif untuk mengatasi masalah...", opt: ["Kulit kering", "Hiperpigmentasi", "Kerutan", "Pori-pori besar"], a: 1 },
    { q: "Ingredients yang memberikan cooling sensation adalah...", opt: ["Allantoin", "Retinol", "Salicylic Acid", "AHA"], a: 0 },
    { q: "Tea Tree Oil dikenal memiliki sifat alami sebagai...", opt: ["Pelembap khusus kulit berjerawat", "Antimikroba pembasmi bakteri jerawat", "Pencerah kulit instan", "Pelindung sinar UV"], a: 1 },
    { q: "Ingredients Moisturizer kelompok humektan klasik penjaga kelembapan kulit adalah...", opt: ["Dimethicone", "Paraffin Wax", "Olive Oil", "Glycerin"], a: 3 },
    { q: "Derivatif vitamin C dikenal juga sebagai...", opt: ["Vitamin A paling powerful", "Vitamin C yang lebih stabil", "Vitamin C paling memerahkan", "Vitamin E antioksidan"], a: 1 },
    { q: "Ingredients Brightening alami dari ekstrak tumbuhan yang aman untuk kulit sensitif adalah...", opt: ["Licorice Root Extract", "Bleaching Agent", "Hydroquinone", "Merkuri"], a: 0 },
    { q: "Ingredients aktif yang tidak boleh dipakai bersamaan dengan Retinol dalam 1 jadwal?", opt: ["Hyaluronic Acid", "Ceramide", "Panthenol", "AHA"], a: 3 },
    { q: "Bolehkah memakai Vitamin C dosis tinggi bersamaan dengan AHA?", opt: ["Boleh banget dicampur setiap hari", "Tidak boleh, berisiko iritasi parah", "Setiap pagi dicampur", "Boleh dicampur pada malam hari"], a: 1 },
    { q: "Bahan calming apa yang sangat cocok dipadukan dengan Salicylic Acid?", opt: ["Lactic Acid", "Retinol High Dose", "Glycolic Acid", "Centella Asiatica"], a: 3 },
    { q: "Urutan pemakaian produk skincare berdasarkan tekstur yang benar adalah...", opt: ["Dari paling kental ke paling encer", "Dari paling encer ke paling kental", "Acak saja bebas", "Dari yang paling mahal ke yang paling murah"], a: 1 },
    { q: "Setelah memakai Retinol di malam hari, wajib hukumnya memakai apa di pagi harinya?", opt: ["Scrub kasar wajah", "Minyak zaitun", "Masker tanah liat", "Sunscreen"], a: 3 },
    { q: "Ingredients apa yang paling aman dipakai dengan Niacinamide untuk melembapkan?", opt: ["Hydroquinone", "High Dose Exfoliator", "Benzoyl Peroxide", "Ceramide"], a: 3 },
    { q: "Apa yang terjadi jika tidak re-apply sunscreen saat beraktivitas seharian di luar?", opt: ["Perlindungan UV menurun / tidak tahan lama", "Muka otomatis berjerawat parah", "Kulit makin glowing", "Tidak ada efek apa pun"], a: 0 },
    { q: "Kapan waktu yang tepat mengaplikasikan Moisturizer?", opt: ["Saat kulit masih sedikit lembap", "Seminggu sekali saja", "Hanya saat kulit mengelupas", "Hanya setelah mencuci tangan"], a: 0 },
    { q: "Jika menggunakan serum Vitamin C di pagi hari, produk apa yang wajib mendampinginya?", opt: ["Sunscreen", "Night Cream", "Sleeping Mask", "Exfoliating Toner"], a: 0 },
    { q: "Teknik double cleansing paling penting dilakukan pada saat...", opt: ["Bangun tidur di pagi hari", "Malam hari setelah beraktivitas", "Sebelum makan siang", "Saat sedang makan"], a: 1 },
    { q: "Pemakaian spot treatment jerawat dilakukan pada urutan...", opt: ["Paling akhir setelah moisturizer meresap", "Sebelum mencuci muka", "Sebelum memakai toner", "Dicampur dengan facial wash"], a: 0 },
    { q: "Ciri utama produk berjenis \"Water-Based\" adalah...", opt: ["Terasa lengket dan berat di kulit", "Cepat menyerap dan berbahan dasar air", "Mengandung lapisan minyak tebal", "Susah dibilas dengan air"], a: 1 },
    { q: "Apa fungsi utama dari \"Sleeping Mask\"?", opt: ["Untuk dipakai saat tidur siang 10 menit", "Mengunci seluruh skincare dan melembapkan sepanjang malam", "Sebagai tabir surya di malam hari", "Untuk mengeringkan jerawat saat tidur"], a: 1 },
    { q: "Jerawat meradang (Cystic Acne) sebaiknya ditangani dengan cara...", opt: ["Dipencet keras agar pecah", "Diberikan Spot Treatment", "Digaruk sampai kering", "Dibiarkan menggunakan alkohol"], a: 1 },
    { q: "Kulit beruntusan di dahi biasanya disebabkan oleh...", opt: ["Terlalu banyak minum air", "Pori-pori tersumbat", "Terlalu sering menggunakan moisturizer", "Kulit terlalu lembab"], a: 1 },
    { q: "Apa perbedaan kulit dehidrasi dan kulit kering?", opt: ["Tidak ada bedanya sama sekali", "Kering adalah jenis kulit kurang minyak, dehidrasi adalah kondisi kulit kurang air", "Kering kurang air, dehidrasi kurang minyak", "Kering harus kusam, dehidrasi harus berwarna putih"], a: 1 },
    { q: "AHA larut dalam...", opt: ["Minyak", "Asam sulfat", "Alkohol", "Air"], a: 3 },
    { q: "BHA larut dalam...", opt: ["Air", "Minyak", "Keringat", "Udara"], a: 1 },
    { q: "Produk tanpa sebuah produk skincare sudah kadaluarsa setelah dibuka dapat dilihat pada ikon...", opt: ["Gambar matahari", "Simbol jar/toples terbuka dengan angka seperti 12M", "Simbol bintang", "Simbol daun hijau"], a: 1 },
    { q: "Mencuci muka menggunakan air yang terlalu panas dapat menyebabkan...", opt: ["Kulit menjadi putih bercahaya", "Minyak alami wajah terkikis habis dan kulit menjadi sangat kering", "Jerawat langsung hilang permanen", "Skin barrier menjadi lebih kuat kebal"], a: 1 }
];

const bankSoalL2 = [
    { q: "Manakah Ingredients berikut yang berfungsi sebagai skin barrier sekaligus soothing?", opt: ["Ceramide", "Parfum Sintetis", "Mineral Oil", "Panthenol"], correctIndices: [0, 3] },
    { q: "Pilih Ingredients yang termasuk dalam kategori exfoliator!", opt: ["Glycolic Acid", "Salicylic Acid", "Ceramide", "Lactic Acid"], correctIndices: [0, 1, 3] },
    { q: "Pilih Ingredients yang terbukti membantu memudarkan bekas jerawat!", opt: ["Alpha Arbutin", "Petroleum Jelly", "Niacinamide", "Tranexamic Acid"], correctIndices: [0, 2, 3] },
    { q: "Ingredients manakah yang disarankan untuk memperbaiki skin barrier rusak?", opt: ["Alkohol 40%", "Ceramide", "Scrub Kasar", "Panthenol"], correctIndices: [1, 3] },
    { q: "Produk apa saja yang wajib ada dalam basic skincare routine pagi hari?", opt: ["Moisturizer", "Sleeping Mask", "Sunscreen", "Face Wash"], correctIndices: [0, 2, 3] },
    { q: "Pilih Ingredients dalam moisturizer yang termasuk kelompok humektan penarik air!", opt: ["Hyaluronic Acid", "Kaolin Clay", "Salicylic Acid", "Glycerin"], correctIndices: [0, 3] },
    { q: "Ingredients apa saja yang tidak disarankan dipakai bersamaan dengan Retinol?", opt: ["AHA", "Ceramide", "BHA", "High Dose Vitamin C"], correctIndices: [0, 2, 3] },
    { q: "Apa saja tanda-tanda jika kulit mengalami Over-Exfoliation?", opt: ["Kulit menjadi kebal", "Kulit terasa perih dan kemerahan", "Minyak hilang permanen", "Skin barrier terasa menipis"], correctIndices: [1, 3] },
    { q: "Manakah Ingredients Brightening yang aman digunakan untuk mengatasi kulit kusam?", opt: ["Hydroquinone", "Tranexamic Acid", "Niacinamide", "Vitamin C"], correctIndices: [1, 2, 3] },
    { q: "Pilih fungsi utama dari penggunaan Sunscreen di pagi hari!", opt: ["Mencegah penuaan dini", "Membuat wajah kebal jerawat", "Mencegah flek hitam", "Melindungi kulit dari radiasi UV"], correctIndices: [0, 2, 3] },
    { q: "Kebiasaan buruk apa saja yang bisa memicu timbulnya jerawat di wajah?", opt: ["Jarang cuci muka setelah berkegiatan", "Banyak minum air putih", "Tidur 8 jam sehari", "Sering menyentuh wajah dengan tangan kotor"], correctIndices: [0, 3] },
    { q: "Pilih Ingredients skincare yang bersifat soothing / mendinginkan kulit meradang!", opt: ["AHA 10%", "Allantoin", "Retinol 2%", "Panthenol"], correctIndices: [1, 3] },
    { q: "Faktor apa saja yang memengaruhi cepat/lambatnya hasil skincare di wajah?", opt: ["Konsistensi pemakaian", "Harga produk skincare mahal", "Gaya hidup", "Kondisi awal skin barrier"], correctIndices: [0, 2, 3] },
    { q: "Dari statement ini, manakah yang benar tentang toner?", opt: ["Toner wajib dibilas dengan sabun", "Ada toner hydrating dan exfoliating", "Toner dipakai sebelum cuci muka", "Tekstur Toner watery"], correctIndices: [1, 3] },
    { q: "Pilih produk yang pas untuk merawat remaja pemula usia sekolah!", opt: ["Gentle cleanser pH seimbang", "Serum Retinol dosis tinggi", "Sunscreen ringan", "Moisturizer barrier"], correctIndices: [0, 2, 3] },
    { q: "Apa saja kondisi yang mengharuskan kamu melakukan Double Cleansing?", opt: ["Setelah memakai makeup waterproof", "Saat tidak memakai skincare seharian", "Setelah bangun tidur pagi", "Setelah re-apply sunscreen seharian"], correctIndices: [0, 3] },
    { q: "Cara untuk mengaplikasikan serum wajah yang benar adalah...", opt: ["Digosok kasar dengan handuk", "Diteteskan di tangan lalu ditepuk ke wajah", "Dicampur bersama sabun cuci muka", "Diteteskan langsung ke kulit tanpa tersentuh pipet"], correctIndices: [1, 3] },
    { q: "Manakah dari produk berikut yang teksturnya thick saat diaplikasikan?", opt: ["Serum Hyaluronic Acid murni", "Toner AHA BHA", "Facial Wash Gel", "Moisturizer dengan Glycerin tinggi"], correctIndices: [0, 3] },
    { q: "Apa fungsi dari ingredients antioksidan (Vitamin E/Green Tea) dalam skincare pagi?", opt: ["Mengeringkan jerawat dalam semalam", "Mencegah kerusakan sel radikal bebas", "Membantu meningkatkan kinerja sunscreen", "Menenangkan kulit dari polusi"], correctIndices: [1, 2, 3] },
    { q: "Jika memiliki kulit berminyak, hal apa yang sebaiknya dihindari dalam produk?", opt: ["Niacinamide 2%", "Fragrance berlebihan", "Mineral Oil berat", "Alkohol tinggi"], correctIndices: [1, 2, 3] }
];

const bankSoalL3 = [
    { q: "Sinta memiliki kulit yang sangat berjerawat dan sensitif. Ia membaca bahwa double cleansing penting, jadi sepulang sekolah ia membersihkan wajah dengan micellar water, lalu mencuci muka pakai facial wash. Malamnya, sebelum tidur, ia mengulangi hal yang sama. Karena ia merasa kulitnya masih kotor, ia melakukan deep cleansing lagi agar jerawatnya cepat hilang. Menurut Sinta, semakin sering membersihkan wajahnya menggunakan berbagai bahan bagus seperti itu akan semakin baik. Tindakan Sinta adalah..?", a: false },
    { q: "Aiman yang berusia 15 tahun punya banyak jerawat mendem. Ia direkomendasikan temannya memakai Basic Skincare. Aiman akhirnya rutin menggunakan Gentle Cleanser, Moisturizer gel dengan Ingredients Centella Asiatica, dan Chemical Sunscreen setiap pagi. Pada malam harinya ia memutuskan untuk pakai spot treatment berbahan sulfur di area jerawat mendem, tindakan Aiman adalah..?", a: true },
    { q: "Naisila merasa wajahnya sangat kering sehingga mengelupas akibat cuaca panas ekstrim. Sesampainya di rumah, ia menggunakan Hydrating Toner sebanyak 3 layer. Setelah toner agak meresap namun kulit masih sedikit lembap, Naisila langsung mengunci hidrasi tersebut menggunakan Moisturizer bertekstur Rich dengan Ingredients Hyaluronic Acid dan Ceramide. Tindakan Naisila secara keseluruhan adalah..?", a: true },
    { q: "Alam ingin mencerahkan kulit kusamnya setelah liburan panjang. Karena sangat ambisius ingin hasilnya cepat, ia membeli serum 15% Vitamin C dan mencampurkannya dengan Vitamin C dari buah jeruk lalu mengoleskannya ke seluruh wajahnya. Setelah itu didiamkan 20 menit dan dibilas. Ia meyakini bahwa metode ini membuat kulitnya lebih cepat cerah karena kandungan Vitamin C yang tinggi. Tindakan Alam adalah..?", a: false },
    { q: "Fida, seorang anak SMK baru saja mencoba exfoliasi untuk pertama kali menggunakan toner AHA. Setelah memakainya, wajahnya tidak terasa cekit-cekit sama sekali. Karena merasa produknya tidak bereaksi, ia lalu menambahkan langsung Exfoliating Toner tersebut berkali-kali ke kapas dan menggosokkannya kencang-kencang ke area hidung dan pipinya sehingga ia merasa baru produknya bekerja. Tindakan Fida adalah..?", a: false },
    { q: "Gigih selalu rajin memakai sunscreen 2 jari setiap jam 6 pagi sebelum berangkat sekolah. Namun, karena ia aktif mengikuti ekstrakurikuler paduan suara hingga pulang sekolah jam 5 sore dan sering berkeringat, ia tidak pernah re-apply sunscreen dengan alasan sunscreen pagi sudah cukup karena terasa perlindungan pagi yang masih melekat. Tindakan Gigih adalah..?", a: false },
    { q: "Danika baru saja membeli Moisturizer baru dengan ingredients Squalane dan Niacinamide. Sebelum mengoleskannya ke seluruh wajah, Danika melakukan patch test dengan mengoleskan sedikit produk tersebut di area belakang telinga atau rahang selama 24 jam untuk melihat apakah ada reaksi kemerahan atau gatal sebelum ia berani memasangnya rutin. Tindakan Danika adalah..?", a: true },
    { q: "Aini merasa wajahnya sangat berminyak. Untuk mengatasinya, Aini sama sekali tidak pernah memakai Moisturizer karena ia merasa wajahnya sudah lembab karena minyak. Sebaliknya, ia rutin menyemprotkan face mist saja ke wajahnya pada siang dan malam hari sebagai pengganti Moisturizer. Tindakan Aini adalah..?", a: false },
    { q: "Ayubi mengalami sebuah jerawat besar kemerahan di dahinya. Jerawat tersebut secara perlahan mengecil. Ia sangat penasaran sama isinya. Malam harinya, setelah mencuci muka dan mengaplikasikan basic skincare, ia menempelkan Acne Patch di atas jerawatnya dan membiarkannya semalaman untuk menyerap cairan nanah. Tindakan Ayubi adalah..?", a: true },
    { q: "Bayangkan ibu kalian sedang dalam masa mengandung/menyusui. Suatu ketika kamu melihat ibumu menggunakan Serum Retinol dengan presentase 2%. Saat kalian tanya, alasan ibu kalian menggunakan Serum Retinol adalah karena kulitnya sudah mulai keriput. Dan saat itu juga kalian pun membiarkan nya karena alasan yang cukup masuk akal. Tindakan Kalian adalah..?", a: false }
];

let triviaState = { playerName: '', level: 1, lives: 0, currentIndex: 0, timer: null, timeLeft: 0, questions: [], multiAnswers: [] };

function initTrivia() {
    stopBGM();
    clearInterval(triviaState.timer);
    
    // Cek jika user sudah Expert (Level 3 selesai)
    let currentUnlocked = parseInt(localStorage.getItem('skincare_unlocked_level') || 0);
    if (currentUnlocked >= 3) {
        document.getElementById('trivia-container').innerHTML = `
            <div class="trivia-box" style="padding: 30px 20px;">
                <h3 style="color: #D81B60; font-size: 18px; margin-bottom: 20px; line-height: 1.5;">Anda sudah mendapat Badge Expert atau sudah menyelesaikan semua level pada Trivia Skincare.</h3>
                <div style="display:flex; flex-direction:column; gap: 10px; align-items:center;">
                    <button class="menu-btn" style="width:80%;" onclick="playSFX('click'); switchScreen('home-screen')">Kembali ke Beranda</button>
                </div>
            </div>
        `;
        return;
    }

    // Jika belum Expert, tampilkan screen biasa
    document.getElementById('trivia-container').innerHTML = `
        <div class="trivia-box" style="padding: 25px 20px;">
            <h3 style="color: #D81B60; font-size: 16px; margin-bottom: 8px;">Yakin udah jago di dunia skincare?</h3>
            <h3 style="color: #D81B60; font-size: 18px; margin-bottom: 20px;">Coba tes yuk!</h3>
            <p style="margin-bottom: 15px; font-weight: bold;">Masukkan nama kamu untuk memulai:</p>
            <input type="text" id="trivia-name-input" class="form-input" placeholder="Ketik namamu di sini...">
            <div style="display:flex; justify-content:center;"><button class="menu-btn" onclick="playSFX('click'); setTriviaName()">Lanjut</button></div>
        </div>
    `;
}

function setTriviaName() {
    const name = document.getElementById('trivia-name-input').value;
    if (name) { 
        triviaState.playerName = name; 
        showLevelInfo(1); 
    } else {
        alert("Isi nama dulu dong!");
    }
}

function showLevelInfo(lvl) {
    let title = "", typeText = "", time = 0, lives = 0;
    if (lvl === 1) { title = "Rookie"; typeText = "Pilihan Ganda"; time = 10; lives = 5; }
    if (lvl === 2) { title = "Middle"; typeText = "Multi Choice"; time = 10; lives = 5; }
    if (lvl === 3) { title = "Expert"; typeText = "Benar / Salah"; time = 15; lives = 3; }

    document.getElementById('trivia-container').innerHTML = `
        <div class="trivia-box" style="padding: 25px 20px;">
            <h3 style="color: #D81B60; font-size: 18px;">Halo ${triviaState.playerName}!</h3>
            <p style="margin-top: 10px;">Sebelum masuk, perhatikan sistem permainannya:</p>
            
            <div style="background: #FFF; border: 2px solid #D81B60; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h2 style="margin: 0; margin-bottom: 10px;">Level ${lvl} - ${title}</h2>
                <ul style="text-align:left; font-size: 12px; color: #555; padding-left: 20px; line-height: 1.6;">
                    <li><strong>Sistem:</strong> ${typeText}</li>
                    <li><strong>Waktu:</strong> ${time} Detik / Soal</li>
                    <li><strong>Total Nyawa:</strong> ${lives} Nyawa</li>
                </ul>
            </div>

            <div style="display:flex; justify-content:center;"><button class="menu-btn" onclick="playSFX('click'); startTriviaLevel(${lvl})">Udah siap belum?</button></div>
        </div>
    `;
}

function startTriviaLevel(lvl) {
    triviaState.level = lvl;
    triviaState.currentIndex = 0;
    
    if (lvl === 1) {
        triviaState.lives = 5;
        triviaState.questions = shuffleArray(bankSoalL1).slice(0, 20);
    } else if (lvl === 2) {
        triviaState.lives = 5;
        triviaState.questions = shuffleArray(bankSoalL2).slice(0, 10);
    } else if (lvl === 3) {
        triviaState.lives = 3;
        triviaState.questions = shuffleArray(bankSoalL3).slice(0, 10);
    }
    
    initAudio(); 
    bgmAudio.play().catch(()=>{});

    showCountdownAndStart();
}

function showCountdownAndStart() {
    let count = 3;
    document.getElementById('trivia-container').innerHTML = `
        <div class="trivia-box" style="padding: 40px 20px;">
            <h3 style="color: #D81B60;">Bersiap!</h3>
            <div id="countdown-num" style="font-size: 55px; font-weight: bold; color: #D81B60; margin: 20px 0;">3</div>
        </div>
    `;
    playSFX('countdown');

    const cdInterval = setInterval(() => {
        count--;
        const numElem = document.getElementById('countdown-num');
        if (numElem) {
            if (count > 0) { 
                numElem.innerText = count; 
                playSFX('countdown'); 
            } else { 
                clearInterval(cdInterval); 
                renderQuestionCard(); 
            }
        } else { clearInterval(cdInterval); }
    }, 1000);
}

function startTimer() {
    clearInterval(triviaState.timer);
    triviaState.timeLeft = triviaState.level === 3 ? 15 : 10;
    document.getElementById('timer-display').innerText = `Waktu: ${triviaState.timeLeft} Detik`;

    triviaState.timer = setInterval(() => {
        triviaState.timeLeft--;
        const timeDisplay = document.getElementById('timer-display');
        if (timeDisplay) timeDisplay.innerText = `Waktu: ${triviaState.timeLeft} Detik`;

        if (triviaState.timeLeft <= 0) {
            clearInterval(triviaState.timer);
            submitAnswer('timeout', null);
        }
    }, 1000);
}

function handleMultiCheck(idx) {
    playSFX('click');
    const index = triviaState.multiAnswers.indexOf(idx);
    if (index > -1) triviaState.multiAnswers.splice(index, 1);
    else triviaState.multiAnswers.push(idx);
}

function renderQuestionCard() {
    const q = triviaState.questions[triviaState.currentIndex];
    const container = document.getElementById('trivia-container');
    triviaState.multiAnswers = [];

    let inputHTML = '';
    if (triviaState.level === 1) {
        inputHTML = q.opt.map((o, idx) => `<button class="menu-btn" style="width:100%; box-sizing:border-box; display:block; font-size:12px; margin-top:10px; text-align:left; background:#fff; color:#D81B60; border:1px solid #D81B60;" onclick="playSFX('click'); submitAnswer('abcd', ${idx})">${o}</button>`).join('');
    } else if (triviaState.level === 2) {
        inputHTML = q.opt.map((o, idx) => `
            <label style="display:block; font-size:12px; text-align:left; background:#fff; padding:10px; margin-top:8px; border:1px solid #D81B60; border-radius:10px;">
                <input type="checkbox" onchange="handleMultiCheck(${idx})"> ${o}
            </label>
        `).join('') + `<div style="display:flex; justify-content:center; margin-top:15px;"><button class="menu-btn" onclick="playSFX('click'); submitAnswer('multi', null)">Jawab Sekarang</button></div>`;
    } else if (triviaState.level === 3) {
        inputHTML = `<div class="trivia-btn-container" style="margin-top:20px; width:100%;">
                        <button class="trivia-btn-true" style="flex:1;" onclick="playSFX('click'); submitAnswer('tf', true)">BENAR</button>
                        <button class="trivia-btn-false" style="flex:1;" onclick="playSFX('click'); submitAnswer('tf', false)">SALAH</button>
                     </div>`;
    }

    container.innerHTML = `
        <div class="trivia-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-weight:bold; font-size:12px; color:#555;">
                <span style="color:#D81B60;">Level ${triviaState.level}</span>
                <span>Nyawa: ${triviaState.lives}</span>
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; font-weight:bold; font-size:12px; background:#F8BBD0; padding:6px 10px; border-radius:8px;">
                <span>Soal: ${triviaState.currentIndex + 1}/${triviaState.questions.length}</span>
                <span id="timer-display" style="color:#C2185B;">Waktu: ${triviaState.level === 3 ? 15 : 10} Detik</span>
            </div>

            <p style="margin:15px 0; font-size:14px; font-weight:bold; line-height:1.5;">${q.q}</p>
            ${inputHTML}
        </div>
    `;

    startTimer();
}

function submitAnswer(type, val) {
    clearInterval(triviaState.timer);
    const q = triviaState.questions[triviaState.currentIndex];
    let isCorrect = false;

    if (type === 'abcd') isCorrect = (val === q.a);
    if (type === 'tf') isCorrect = (val === q.a);
    if (type === 'multi') {
        const selected = triviaState.multiAnswers.sort();
        const correct = q.correctIndices.sort();
        isCorrect = selected.length === correct.length && selected.every((v, i) => v === correct[i]);
    }
    if (type === 'timeout') isCorrect = false;

    if (isCorrect) {
        playSFX('correct');
    } else {
        playSFX('wrong');
        triviaState.lives--;
    }

    if (triviaState.lives <= 0) {
        playSFX('gameOver');
        document.getElementById('trivia-container').innerHTML = `
            <div class="trivia-box" style="padding: 30px 20px;">
                <h2 style="font-size:24px;">Game Over!</h2>
                <p>Sayang sekali, nyawa kamu habis di Level ${triviaState.level}.</p>
                <div style="display:flex; justify-content:center;"><button class="menu-btn" style="margin-top:15px;" onclick="playSFX('click'); showLevelInfo(1)">Mulai ulang</button></div>
            </div>
        `;
        return;
    }

    triviaState.currentIndex++;
    if(triviaState.currentIndex >= triviaState.questions.length) {
        levelUpSequence();
    } else {
        renderQuestionCard();
    }
}

function levelUpSequence() {
    playSFX('levelUp');
    
    let currentUnlocked = parseInt(localStorage.getItem('skincare_unlocked_level') || 0);
    if (triviaState.level > currentUnlocked) {
        localStorage.setItem('skincare_unlocked_level', triviaState.level);
    }
    
    const container = document.getElementById('trivia-container');
    
    if (triviaState.level < 3) {
        container.innerHTML = `
            <div class="trivia-box" style="padding: 30px 20px;">
                <h2 style="font-size:24px;">Luar Biasa!</h2>
                <p>Kamu berhasil menyelesaikan <strong>Level ${triviaState.level}</strong>.</p>
                <div style="background: #FFF9C4; color: #F57F17; padding: 15px; border-radius: 15px; margin: 15px 0; font-weight: bold; border: 2px dashed #FBC02D;">
                    BADGE BARU BERHASIL DIKLAIM
                </div>
                <div style="display:flex; justify-content:center;"><button class="menu-btn" onclick="playSFX('click'); showLevelInfo(${triviaState.level + 1})">Lanjut ke Level ${triviaState.level + 1}</button></div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="trivia-box" style="padding: 30px 20px;">
                <h2 style="font-size:24px;">SELAMAT TAMAT!</h2>
                <p>Kamu sudah berhasil menyelesaikan seluruh tantangan <strong>Level Expert</strong>.</p>
                <div style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #fff; padding: 15px; border-radius: 15px; margin: 15px 0; font-weight: bold;">
                    BADGE TERTINGGI TELAH DIKLAIM
                </div>
                <p style="font-size:11px; margin-bottom:20px;">Kamu resmi jadi master skincare dan berhasil melewati semua tantangan mematikan!</p>
                <div style="display:flex; justify-content:center;"><button class="menu-btn" onclick="playSFX('click'); switchScreen('home-screen')">Selesai & Kembali ke Beranda</button></div>
            </div>
        `;
    }
}

function initLeaderboard() {
    document.getElementById('leaderboard-list').innerHTML = `<div style="background:#FFF0F3; padding:10px; border-radius:8px; font-size:12px;"><strong>Naisila</strong> - Expert (Online)</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderHomeBadges();
    checkUpdatePopup();
});