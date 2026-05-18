const { useMemo, useState } = React;

const defaultSchool = {
  name: "Deo Gloria Primary School",
  emis: "909130154",
  type: "Public Ordinary Primary School",
  phase: "Primary School",
  grades: "Grade R to Grade 7",
  quintile: "Quintile 1",
  status: "Open",
  district: "Waterberg District, Limpopo",
  location: "Regorogile / Spitskop, Thabazimbi, Limpopo, South Africa",
  address: "290 Monareng Avenue, Regorogile, Thabazimbi, 0387, Limpopo",
  alternativeAddress: "Spitskop, Thabazimbi, Limpopo",
  phone: "014 772 3045",
  altPhone: "083 575 0684",
  email: "To be confirmed by school management",
  principal: "To be confirmed by school management",
  hours: "Monday to Friday, 07:30-14:30, to be confirmed by school management",
  slogan: "Growing disciplined, confident and successful learners."
};

const pages = [
  ["home", "Home"], ["about", "About Us"], ["academics", "Academics"], ["admissions", "Admissions"],
  ["parents", "Parents"], ["learners", "Learners"], ["teachers", "Teachers"], ["news", "Announcements"],
  ["gallery", "Gallery"], ["contact", "Contact Us"], ["privacy", "Privacy Notice"], ["admin", "Admin"]
];
const mainNav = ["home", "about", "academics", "admissions", "parents", "news", "contact"];
const moreNav = ["learners", "teachers", "gallery", "privacy", "admin"];
const values = ["Respect", "Discipline", "Responsibility", "Excellence", "Ubuntu", "Honesty", "Care"];
const docs = ["Admission form", "Code of conduct", "School calendar", "Uniform list", "Stationery list", "POPIA consent form"];
const defaultNotices = [
  "Important notices, assessment dates and parent meeting updates will appear here.",
  "Term opening and closing notices will be published after confirmation by school management.",
  "Emergency notices will be displayed clearly on this page and shared through official school channels."
];

function loadCmsContent() {
  try {
    const saved = JSON.parse(localStorage.getItem("deoGloriaCms") || "{}");
    return {
      school: { ...defaultSchool, ...(saved.school || {}) },
      notices: Array.isArray(saved.notices) && saved.notices.length ? saved.notices : defaultNotices
    };
  } catch {
    return { school: defaultSchool, notices: defaultNotices };
  }
}

const cmsContent = loadCmsContent();
const school = cmsContent.school;
const notices = cmsContent.notices;

function App() {
  const initial = window.location.hash.replace("#", "") || "home";
  const [page, setPage] = useState(pages.some(([id]) => id === initial) ? initial : "home");
  const [open, setOpen] = useState(false);
  const title = useMemo(() => pages.find(([id]) => id === page)?.[1] || "Home", [page]);
  const go = (id) => { setPage(id); setOpen(false); window.location.hash = id; window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <Navbar page={page} open={open} setOpen={setOpen} go={go} />
      <main>{page === "home" ? <Home go={go} /> : <><PageHeader title={title} go={go} /><Content page={page} /></>}</main>
      <Footer go={go} />
      <a className="whatsapp-button" href="#" aria-label="WhatsApp contact placeholder">WhatsApp</a>
    </>
  );
}

function Navbar({ page, open, setOpen, go }) {
  const item = ([id, label]) => <button key={id} className={page === id ? "active" : ""} type="button" onClick={() => go(id)}>{label}</button>;
  return (
    <header className="site-header">
      <button className="brand" type="button" onClick={() => go("home")} aria-label="Go to home page">
        <span className="brand-mark">DG</span><span><strong>{school.name}</strong><small>EMIS: {school.emis}</small></span>
      </button>
      <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>
      <nav className={open ? "main-nav open" : "main-nav"} aria-label="Main navigation">
        {pages.filter(([id]) => mainNav.includes(id)).map(item)}
        <details className="more-menu"><summary>More</summary><div>{pages.filter(([id]) => moreNav.includes(id)).map(item)}</div></details>
      </nav>
    </header>
  );
}

function PageHeader({ title, go }) {
  return <section className="page-header"><div><p className="eyebrow">{school.name}</p><h1>{title}</h1><p>{school.type} serving {school.location}.</p></div><button className="outline-button" type="button" onClick={() => go("contact")}>Contact the school</button></section>;
}

function Home({ go }) {
  const actions = [["Apply for admission", "Visit the school office and request the official form.", "admissions"], ["Read school notices", "Meeting dates, assessments and urgent notices will be posted here.", "news"], ["Contact the office", "Use verified phone numbers or the enquiry form.", "contact"], ["Understand privacy", "Learner information and photos require proper consent.", "privacy"]];
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span>Public Ordinary Primary School</span><span>Waterberg District</span></div>
          <h1>Deo Gloria Primary School official information hub.</h1>
          <p className="welcome">Welcome to Deo Gloria Primary School, a public primary school serving learners and families in Regorogile, Spitskop, Thabazimbi and surrounding communities in Limpopo.</p>
          <p className="slogan">{school.slogan}</p>
          <p>Deo Gloria Primary School is committed to quality teaching, learner support, discipline, respect and community involvement. The school supports CAPS-aligned teaching and aims to create a safe, caring and organised learning environment.</p>
          <div className="hero-status-grid"><span><strong>EMIS</strong>{school.emis}</span><span><strong>Grades</strong>{school.grades}</span><span><strong>Status</strong>{school.status}</span></div>
          <div className="hero-actions"><button className="primary-button" onClick={() => go("admissions")}>Admissions</button><button className="secondary-button" onClick={() => go("news")}>Announcements</button><button className="outline-button" onClick={() => go("contact")}>Contact Us</button></div>
        </div>
        <div className="hero-quick-panel"><aside><span>School office</span><strong>{school.phone}</strong><small>Alternative: {school.altPhone}</small></aside><aside><span>Address</span><strong>Regorogile</strong><small>Thabazimbi, Limpopo</small></aside></div>
      </section>
      <Notice />
      <section className="dashboard-home">
        <Intro eyebrow="Parent-friendly dashboard" title="What families need most, clearly organised." text="This homepage is designed as a public school notice desk: official details, next steps and important placeholders are easy to find without publishing private learner information." />
        <div className="dashboard-layout"><div className="action-board">{actions.map(([t, x, target]) => <button className="action-row" key={t} onClick={() => go(target)}><span></span><strong>{t}</strong><small>{x}</small></button>)}</div><OfficialCard /></div>
      </section>
      <Facts /><QuickLinks go={go} /><Documents />
    </>
  );
}

function Content({ page }) {
  if (page === "about") return <section className="section"><div className="two-column"><div><Intro eyebrow="School profile" title="A public primary school serving Thabazimbi families." /><p>Deo Gloria Primary School is a public ordinary primary school located in Thabazimbi, Limpopo. The school serves learners from Regorogile, Spitskop and nearby communities. It focuses on quality basic education, learner discipline, academic improvement, safety and parental involvement.</p><Panel title="School history">The detailed history of Deo Gloria Primary School will be added after confirmation by school management.</Panel><Panel title="Principal's message">The principal's official message will be added after approval by school management.</Panel></div><div className="stack"><Card title="Vision">To develop responsible, disciplined and confident learners who are prepared for lifelong learning and positive contribution to society.</Card><Card title="Mission">To provide quality CAPS-aligned teaching and learning in a safe, inclusive and supportive school environment.</Card></div></div><List title="Values" items={values} compact /><List title="Why parents should choose the school" items={["Public primary school serving the local Thabazimbi community", "CAPS-aligned teaching and learning", "Focus on discipline and learner support", "Parent and community involvement", "Safe and caring school environment", "Communication through notices, meetings and digital updates"]} /></section>;
  if (page === "academics") return <section className="section"><Intro eyebrow="Teaching and learning" title="CAPS-aligned learning from Grade R to Grade 7." text="Deo Gloria Primary School encourages learners, parents and teachers to work together to improve academic performance." /><div className="card-grid three"><Subject title="Foundation Phase" items={["Home Language", "First Additional Language", "Mathematics", "Life Skills"]} /><Subject title="Intermediate Phase" items={["Home Language", "First Additional Language", "Mathematics", "Natural Sciences and Technology", "Social Sciences", "Life Skills"]} /><Subject title="Senior Phase, Grade 7" items={["Home Language", "First Additional Language", "Mathematics", "Natural Sciences", "Technology", "Social Sciences", "Economic and Management Sciences", "Life Orientation", "Creative Arts"]} /></div><Panel title="Important academic note">Subjects must be confirmed with the school's official timetable and CAPS documents.</Panel><Cards items={["CAPS-aligned teaching", "Assessment information", "Academic intervention and learner support", "Homework and study support", "Reading and numeracy improvement"]} /></section>;
  if (page === "admissions") return <section className="section"><Intro eyebrow="Admissions" title="Admissions at Deo Gloria Primary School" /><div className="two-column"><List ordered title="How to apply" items={["Visit the school office.", "Ask for the official admission application form.", "Complete the form and attach the required documents.", "Submit the form to the school office.", "Wait for confirmation from the school."]} /><List title="Documents needed" items={["Learner birth certificate", "Parent/guardian ID copy", "Proof of residence", "Immunisation card / clinic card where applicable", "Transfer card or last school report if the learner attended another school", "For non-South African citizens: study permit, residence permit, asylum seeker/refugee document, or proof of application where applicable"]} /></div><ContactSummary /><Documents /></section>;
  if (page === "parents") return <section className="section"><Intro eyebrow="Parents" title="Clear information for families and guardians." text="Parents are important partners in learner discipline, attendance, homework and school improvement." /><div className="card-grid"><Card title="School calendar">Term dates, events and meeting dates will be updated after confirmation.</Card><Card title="Meeting notices">Parent meeting reminders and grade meetings will be published here.</Card><Card title="Code of conduct">The approved school code of conduct can be uploaded in the documents section.</Card><Card title="School fees">Deo Gloria Primary School is listed as a Quintile 1 public school. School fee information must be confirmed annually with the school and School Governing Body.</Card><Card title="Uniform information">Uniform details will be added after confirmation by school management.</Card></div><List title="Communication rules" items={["Parents must use official school communication channels.", "Urgent matters must be directed to the school office.", "Respectful communication is expected at all times."]} /><List title="Parent involvement" compact items={["Attend meetings", "Support homework", "Encourage reading", "Communicate with teachers", "Support school rules and discipline"]} /></section>;
  if (page === "learners") return <section className="section"><Intro eyebrow="Learners" title="Support for safe, confident and successful learners." /><Cards items={["Homework support", "Study tips", "School rules", "Reading corner", "Learner achievements"]} /><Panel title="Anti-bullying message">Bullying is not accepted at Deo Gloria Primary School. Learners must report bullying to a teacher, class teacher, HOD, deputy principal or principal.</Panel><Panel title="Learner wellbeing">Every learner deserves to feel safe, respected and supported.</Panel></section>;
  if (page === "teachers") return <section className="section"><Intro eyebrow="Teachers" title="Professional resources and internal communication placeholders." /><Cards three items={["Staff notices", "Subject resources", "CAPS resources", "Assessment plans", "Departmental moderation information", "School-based moderation tools", "Professional development", "ATP and subject file documents", "Internal communication area"]} /></section>;
  if (page === "news") return <section className="section"><Intro eyebrow="Announcements / News" title="Latest school notices and community updates." /><div className="notice-list">{notices.map((n, i) => <article className="notice-card" key={n}><span>Notice {i + 1}</span><p>{n}</p></article>)}</div><List compact title="Notice categories" items={["Latest school notices", "Events", "Assessment dates", "Departmental circulars", "Sports and cultural activities", "Parent meeting reminders", "Term opening and closing notices", "Emergency notices"]} /></section>;
  if (page === "gallery") return <section className="section"><Intro eyebrow="Gallery" title="Approved school moments and activities." /><Panel title="Photo publishing warning">Only approved photos with written parental consent may be published. Do not use real learner photos unless approved by school management and parents/guardians.</Panel><div className="gallery-grid">{["Events", "Awards", "Sports", "Classroom Activities", "Community Projects"].map((x) => <article className="gallery-card" key={x}><div className="placeholder-art"><span></span></div><h3>{x}</h3><p>Safe placeholder image area. Approved school photos can be added later.</p></article>)}</div></section>;
  if (page === "contact") return <section className="section"><div className="two-column contact-layout"><div><Intro eyebrow="Contact Us" title="Speak to the school office." /><ContactSummary /><div className="map-placeholder">Google Maps placeholder</div></div><ContactForm /></div></section>;
  if (page === "admin") return <AdminPanel />;
  return <section className="section privacy-page"><Intro eyebrow="POPIA Privacy Notice" title="Protecting personal information at school." /><p>Deo Gloria Primary School processes personal information in line with the Protection of Personal Information Act (POPIA). The school collects personal information only for school administration, admissions, communication and learner support.</p><div className="card-grid"><Card title="Children's information">Children's personal information must be protected carefully and processed only for lawful school purposes.</Card><Card title="Photos and names">Learner photos and names may only be published with proper consent from a parent, guardian or authorised person.</Card><Card title="Correction requests">Parents/guardians may contact the school to update or correct personal information.</Card><Card title="Contact forms">The website contact form must not ask for unnecessary personal information.</Card></div><Panel title="Important privacy instruction">Do not publish learner photos, learner names, ID numbers, reports, medical information, addresses, or private information unless written consent is given by the parent/guardian or authorised person.</Panel></section>;
}

function Notice() { return <section className="notice-strip"><strong>Announcement:</strong><span>{notices[0]}</span></section>; }
function Facts() { return <section className="facts-band"><Fact label="EMIS" value={school.emis} /><Fact label="Grades" value={school.grades} /><Fact label="Status" value={school.status} /><Fact label="District" value={school.district} /></section>; }
function OfficialCard() { return <article className="official-card"><p className="eyebrow">Official profile</p><h2>Verified and to-confirm details</h2><dl><Info label="School profile" value={`${school.type} | ${school.phase}`} /><Info label="Location" value={school.location} /><Info label="Address to verify" value={school.address} /><Info label="Email" value={school.email} /></dl></article>; }
function QuickLinks({ go }) { return <section className="section"><Intro eyebrow="Quick links" title="Helpful information for every school stakeholder." text="Choose the area you need. The school can replace placeholders with approved documents and official updates." /><div className="card-grid">{[["Parents", "Calendar, notices, conduct and communication rules", "parents"], ["Learners", "Homework support, school rules and wellbeing", "learners"], ["Teachers", "CAPS resources, assessment plans and internal notices", "teachers"], ["School Documents", "Admission forms, policies and consent forms", "admissions"]].map(([t, x, target]) => <button className="link-card" key={t} onClick={() => go(target)}><span className="card-icon">{t[0]}</span><strong>{t}</strong><small>{x}</small></button>)}</div></section>; }
function Cards({ items, three = false }) { return <div className={three ? "card-grid three" : "card-grid"}>{items.map((t) => <Card key={t} title={t}>Approved details and documents can be added by school management.</Card>)}</div>; }
function ContactSummary() { return <div className="summary-card"><h3>{school.name}</h3><dl><Info label="EMIS" value={school.emis} /><Info label="Address" value={school.address} /><Info label="Alternative listed location" value={school.alternativeAddress} /><Info label="Telephone" value={school.phone} /><Info label="Alternative number" value={school.altPhone} /><Info label="Email" value={school.email} /><Info label="Principal" value={school.principal} /><Info label="Office hours" value={school.hours} /></dl></div>; }
function ContactForm() { const [sent, setSent] = useState(false); return <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}><h2>Send an enquiry</h2><label>Name<input required /></label><label>Email<input type="email" required /></label><label>Phone number<input type="tel" /></label><label>Message<textarea rows="5" required></textarea></label><label className="check-row"><input type="checkbox" required /><span>I consent to Deo Gloria Primary School processing my personal information for the purpose of responding to my enquiry.</span></label><button className="primary-button" type="submit">Submit enquiry</button>{sent && <p className="form-success">Thank you. This demo form is ready for connection to the school's approved email system.</p>}</form>; }
function Documents() { return <section className="document-section"><div><p className="eyebrow">Downloadable documents</p><h2>School documents placeholder</h2><p>Upload approved PDF documents here when they are confirmed by school management.</p></div><div className="document-grid">{docs.map((d) => <a key={d} href="#"><span>PDF</span>{d}</a>)}</div></section>; }
function AdminPanel() { const [form, setForm] = useState({ ...school }); const [noticeText, setNoticeText] = useState(notices.join("\n")); const [importText, setImportText] = useState(""); const [message, setMessage] = useState(""); const fields = [["name", "School name"], ["slogan", "Slogan"], ["phone", "Telephone"], ["altPhone", "Alternative number"], ["email", "Email"], ["principal", "Principal"], ["address", "Address"], ["alternativeAddress", "Alternative listed location"], ["hours", "Office hours"]]; const update = (key, value) => setForm({ ...form, [key]: value }); const cleanNotices = () => noticeText.split("\n").map((item) => item.trim()).filter(Boolean); const content = () => ({ school: form, notices: cleanNotices().length ? cleanNotices() : defaultNotices }); function save(event) { event.preventDefault(); localStorage.setItem("deoGloriaCms", JSON.stringify(content())); setMessage("Saved on this browser. Refreshing the website now..."); setTimeout(() => window.location.reload(), 500); } function reset() { localStorage.removeItem("deoGloriaCms"); setMessage("CMS content reset. Refreshing the website now..."); setTimeout(() => window.location.reload(), 500); } function exportCms() { const blob = new Blob([JSON.stringify(content(), null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "deo-gloria-primary-school-cms.json"; link.click(); URL.revokeObjectURL(url); } function importCms() { try { const imported = JSON.parse(importText); localStorage.setItem("deoGloriaCms", JSON.stringify({ school: { ...defaultSchool, ...(imported.school || {}) }, notices: Array.isArray(imported.notices) && imported.notices.length ? imported.notices : defaultNotices })); setMessage("Imported CMS backup. Refreshing the website now..."); setTimeout(() => window.location.reload(), 500); } catch { setMessage("Import failed. Please paste a valid CMS JSON backup."); } } return <section className="section admin-page"><Intro eyebrow="Admin / CMS" title="Edit school notices and public contact details." text="This static CMS saves changes in this browser. Use Export backup after editing so the content can be kept safely or sent for publishing." /><div className="admin-layout"><form className="admin-panel" onSubmit={save}><h2>School details</h2><div className="admin-grid">{fields.map(([key, label]) => <label key={key}>{label}<input value={form[key] || ""} onChange={(event) => update(key, event.target.value)} /></label>)}</div><label>Announcements, one per line<textarea rows="8" value={noticeText} onChange={(event) => setNoticeText(event.target.value)} /></label><div className="admin-actions"><button className="primary-button" type="submit">Save changes</button><button className="outline-button" type="button" onClick={exportCms}>Export backup</button><button className="danger-button" type="button" onClick={reset}>Reset local CMS</button></div>{message && <p className="form-success">{message}</p>}</form><aside className="admin-panel"><h2>Import backup</h2><p>Paste a previously exported CMS JSON backup here, then import it on this browser.</p><textarea rows="10" value={importText} onChange={(event) => setImportText(event.target.value)} placeholder='{"school": {...}, "notices": [...]}'></textarea><button className="primary-button" type="button" onClick={importCms}>Import backup</button><Panel title="Publishing note">For everyone online to see the same CMS edits, the saved content must later be connected to a hosted database or committed back to GitHub.</Panel></aside></div></section>; }
function Intro({ eyebrow, title, text }) { return <div className="section-intro"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p>{text}</p>}</div>; }
function Card({ title, children }) { return <article className="page-card"><h3>{title}</h3><p>{children}</p></article>; }
function Panel({ title, children }) { return <article className="info-panel"><h3>{title}</h3><p>{children}</p></article>; }
function Subject({ title, items }) { return <article className="page-card"><h3>{title}</h3><ul>{items.map((i) => <li key={i}>{i}</li>)}</ul></article>; }
function List({ title, items, ordered = false, compact = false }) { const Tag = ordered ? "ol" : "ul"; return <section className="list-section"><h2>{title}</h2><Tag className={compact ? "pill-list" : ""}>{items.map((i) => <li key={i}>{i}</li>)}</Tag></section>; }
function Info({ label, value }) { return <div><dt>{label}</dt><dd>{value}</dd></div>; }
function Fact({ label, value }) { return <article><span>{label}</span><strong>{value}</strong></article>; }
function Footer({ go }) { return <footer className="site-footer"><div><h2>{school.name}</h2><p>EMIS: {school.emis}</p><p>{school.address}</p><p>Tel: {school.phone}</p></div><div><button type="button" onClick={() => go("privacy")}>Privacy notice</button><p>Copyright {new Date().getFullYear()} {school.name}. All rights reserved.</p></div></footer>; }

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
