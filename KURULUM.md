# Siteyi yayına alma ve güncelleme

## 1. İlk kurulum (bir kere yapılır, ~10 dakika)

1. GitHub'a gir, sağ üstten **New repository**.
2. Repo adı tam olarak şu olmalı: `enesisaoglu.github.io` (Public seç, başka bir şey ekleme), **Create repository**.
3. Açılan sayfada **uploading an existing file** linkine tıkla.
4. Zip'ten çıkan klasörün **içindeki her şeyi** sürükle bırak (`build.py`, `content`, `static`, `templates` vs.).
   - Dikkat: `.github` klasörü gizli olduğu için görünmeyebilir. Mac'te Finder'da `Cmd + Shift + .`,
     Windows'ta Görünüm → Gizli öğeler ile görünür yap ve onu da sürükle. Bu klasör olmazsa site yayınlanmaz.
   - Yine de yüklenmezse: repo'da **Add file → Create new file**, dosya adına `.github/workflows/deploy.yml` yaz
     ve zip'teki aynı dosyanın içeriğini yapıştır.
5. **Commit changes**.
6. Repo'da **Settings → Pages → Build and deployment → Source: GitHub Actions** seç.
7. **Actions** sekmesine git, "Build and deploy" çalışıyor olacak. Yeşil tik gelince
   https://enesisaoglu.github.io açılır (ilk seferde 1-2 dakika sürebilir).
   Yeşil tik gelmediyse Actions'a girip **Run workflow** butonuna bas.

## 2. Google'da çıkması için

1. https://search.google.com/search-console adresine git, **URL prefix** seç, `https://enesisaoglu.github.io` yaz.
2. Doğrulama yöntemi olarak **HTML tag** seç. Sana `<meta name="google-site-verification" content="ABC123..." />` verecek.
3. Sadece tırnak içindeki kodu (`ABC123...`) kopyala, `site.yml` dosyasındaki `google_verification: ""` satırına yapıştır, commit et.
4. 1-2 dakika bekle (site yeniden yayınlanır), Search Console'da **Verify**.
5. Sol menüde **Sitemaps** → `sitemap.xml` yaz → **Submit**.
6. LinkedIn profilinde "Website" alanına ve GitHub profilinde bio/website alanına site linkini ekle.
   Bu, Google'ın siteyi senin adınla eşleştirmesini çok hızlandırır.

## 3. Güncelleme (her şey GitHub sitesinden yapılabilir, bilgisayar gerekmez)

Bir dosyayı açıp sağ üstteki kalem ikonuna tıkla, değiştir, **Commit changes**. 1-2 dakika sonra site güncellenir.

| Ne yapmak istiyorsun | Hangi dosya |
|---|---|
| Blog yazısı eklemek | `content/posts/` içinde **Add file → Create new file**, adı `2026-12-01-yazinin-adi.md`. İçeriği `_TEMPLATE.md`'den kopyala, `draft: false` yap. Yazı Writing sayfasında yıla göre listelenir, ana sayfada son 3 yazı görünür |
| Makale eklemek | `content/papers.yml` (mevcut bloğu kopyala, en üste yapıştır, değiştir). Research sayfasında görünür |
| Makale PDF'i | `static/papers/` klasörü oluşturup yükle, `pdf: /papers/dosya.pdf` yaz. Dergi incelemesi bitmeden PDF koymamanı öneririm |
| Proje eklemek, fotoğraf, video, GitHub linki | `content/projects.yml`. YouTube videosunu sayfada oynatmak için `video_embed: https://www.youtube.com/embed/VIDEO_ID` |
| Deneyim ve şirket logoları | `content/experience.yml`. Logo yoksa kutuda harfler (`mark`) görünür. Logo koymak istersen şirketin resmi logosunu `static/img/logos/` içine yükle, `logo: /img/logos/atlas.png` yaz |
| Robotta görünen yetenekler | `content/skills.yml` (`learning: true` eklersen "learning now" yazar) |
| Eğitim, diller, tanıtım yazısı, e-posta, linkler | `site.yml` |
| CV'yi değiştirmek | `static/cv/` içine aynı isimle (`Enes_Isaoglu_CV.pdf`) yeni dosyayı yükle |
| Blog fotoğrafı | `static/img/` içine yükle, yazıda `![açıklama](/img/dosya-adi.jpg)` |

Bir hata yaparsan (ör. YAML'da girinti bozulursa) Actions sekmesinde kırmızı çarpı çıkar ve
eski site yayında kalmaya devam eder. Kırmızıya tıklarsan hangi dosyada ne hata olduğu yazar.

Blog yazısının adresi dosya adından gelir: `2026-12-01-mujoco-ile-ilk-adim.md` → `enesisaoglu.github.io/blog/mujoco-ile-ilk-adim/`
