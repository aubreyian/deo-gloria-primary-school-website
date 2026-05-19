const { useEffect, useMemo, useState } = React;

const ADMIN_PASSWORD = "DeoGloria@2026";
const STORAGE_KEY = "deoGloriaSchoolAutomation";

const pageLinks = [
  ["home", "Home"], ["about", "About"], ["academics", "Academics"], ["admissions", "Admissions"],
  ["parents", "Parents"], ["learners", "Learners"], ["teachers", "Teachers"], ["news", "Notices"],
  ["calendar", "Calendar"], ["downloads", "Documents"], ["faq", "FAQ"], ["gallery", "Gallery"],
  ["contact", "Contact"], ["privacy", "Privacy"], ["admin", "Admin / CMS"]
];

const categories = {
  announcement: ["General Notices", "Parent Meetings", "Assessment Dates", "Term Dates", "Departmental Notices", "Sports and Culture", "Emergency Notices"],
  audience: ["All", "Parents", "Learners", "Teachers"],
  urgency: ["Normal", "Important", "Urgent"],
  event: ["This week", "This month", "Assessments", "Parent meetings", "School events"],
  documents: ["Admission Forms", "School Policies", "Parent Notices", "Assessment Plans", "Calendars", "POPIA Forms"],
  faq: ["Admissions", "School Fees", "Uniform", "Academics", "Communication", "POPIA"],
  enquiry: ["Admissions", "Finance", "Academics", "Discipline", "General"],
  status: ["New", "In progress", "Resolved"]
};

const initialData = {
  settings: {
    schoolName: "Deo Gloria Primary School",
    emis: "909130154",
    type: "Public Ordinary Primary School",
    phase: "Primary School",
    grades: "Grade R to Grade 7",
    quintile: "Quintile 1",
    status: "Open",
    address: "290 Monareng Avenue, Regorogile, Thabazimbi, 0387, Limpopo",
    alternativeLocation: "Spitskop, Thabazimbi, Limpopo",
    district: "Waterberg District, Limpopo",
    location: "Regorogile / Spitskop, Thabazimbi, Limpopo, South Africa",
    telephone: "014 772 3045",
    alternativeTelephone: "083 575 0684",
    email: "To be confirmed by school management",
    principal: "To be confirmed by school management",
    hours: "Monday to Friday, 07:30-14:30, to be confirmed by school management",
    slogan: "Growing disciplined, confident and successful learners.",
    whatsapp: "27147723045"
  },
  announcements: [
    { id: 1, title: "Important notices will appear here", date: "2026-05-19", category: "General Notices", audience: "All", urgency: "Important", message: "Important notices, assessment dates and parent meeting updates will appear here." },
    { id: 2, title: "Admissions enquiries are open at the school office", date: "2026-05-18", category: "General Notices", audience: "Parents", urgency: "Normal", message: "Parents may visit the school office to request the official admission application form and confirm required documents." }
  ],
  events: [
    { id: 1, title: "Parent meeting notice placeholder", date: "2026-06-05", time: "To be confirmed", venue: "School premises", audience: "Parents", category: "Parent meetings", description: "Confirmed parent meeting dates will be published after approval by school management." },
    { id: 2, title: "Assessment dates placeholder", date: "2026-06-12", time: "School hours", venue: "Classrooms", audience: "Learners", category: "Assessments", description: "Assessment dates must be confirmed with the official school timetable." }
  ],
  documents: [
    { id: 1, title: "Admission form", description: "Upload the approved PDF admission form when confirmed.", category: "Admission Forms", link: "#", important: true },
    { id: 2, title: "Code of conduct", description: "Upload the approved learner code of conduct.", category: "School Policies", link: "#", important: true },
    { id: 3, title: "POPIA consent form", description: "Upload the approved consent form for website and school communication use.", category: "POPIA Forms", link: "#", important: true },
    { id: 4, title: "School calendar", description: "Upload the official school calendar after approval.", category: "Calendars", link: "#", important: false }
  ],
  faqs: [
    { id: 1, category: "Admissions", question: "How do I apply for admission?", answer: "Visit the school office, ask for the official admission form, attach required documents and submit the form to the office." },
    { id: 2, category: "School Fees", question: "Is the school fee information confirmed?", answer: "Deo Gloria Primary School is listed as a Quintile 1 public school. School fee information must be confirmed annually with the school and School Governing Body." },
    { id: 3, category: "POPIA", question: "Can learner photos be published?", answer: "Learner photos and names may only be published with proper written consent from a parent, guardian or authorised person." }
  ],
  admissions: [],
  messages: []
};

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...initialData, ...saved, settings: { ...initialData.settings, ...(saved.settings || {}) } } : initialData;
  } catch {
    return initialData;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatDate(value) {
  if (!value) return "To be confirmed";
  return new Date(value + "T00:00:00").toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function sortedByDate(items) {
  return [...items].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function nextId(items) {
  return items.length ? Math.max(...items.map(item => Number(item.id) || 0)) + 1 : 1;
}

function App() {
  const [data, setData] = useState(loadData);
  const [page, setPage] = useState(location.hash.replace("#", "") || "home");

  useEffect(() => saveData(data), [data]);
  useEffect(() => {
    const onHash = () => setPage(location.hash.replace("#", "") || "home");
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  function go(id) {
    location.hash = id;
    setPage(id);
    scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Header page={page} go={go} settings={data.settings} />
      <main>
        <Router page={page} go={go} data={data} setData={setData} />
      </main>
      <Footer settings={data.settings} go={go} />
      <WhatsAppButton number={data.settings.whatsapp} />
    </>
  );
}

function Header({ page, go, settings }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="brand" href="#home" onClick={() => go("home")}>
        <span className="badge">DG</span>
        <span><strong>{settings.schoolName}</strong><small>Public Primary School | EMIS {settings.emis}</small></span>
      </a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>
      <nav className={open ? "main-nav open" : "main-nav"}>
        {pageLinks.map(([id, label]) => <button key={id} className={page === id ? "active" : ""} onClick={() => { go(id); setOpen(false); }}>{label}</button>)}
      </nav>
    </header>
  );
}

function Router({ page, go, data, setData }) {
  if (page === "home") return <Home go={go} data={data} />;
  if (page === "about") return <About data={data} />;
  if (page === "academics") return <Academics />;
  if (page === "admissions") return <Admissions data={data} setData={setData} />;
  if (page === "parents") return <Parents data={data} />;
  if (page === "learners") return <Learners />;
  if (page === "teachers") return <Teachers />;
  if (page === "news") return <Announcements data={data} />;
  if (page === "calendar") return <Calendar data={data} />;
  if (page === "downloads") return <Downloads data={data} />;
  if (page === "faq") return <FAQ data={data} />;
  if (page === "gallery") return <Gallery />;
  if (page === "contact") return <Contact data={data} setData={setData} />;
  if (page === "privacy") return <Privacy />;
  if (page === "admin") return <Admin data={data} setData={setData} />;
  return <Home go={go} data={data} />;
}

function Home({ go, data }) {
  const latest = sortedByDate(data.announcements).slice(0, 3);
  const urgent = sortedByDate(data.announcements).find(a => a.urgency === "Urgent" || a.urgency === "Important");
  const upcoming = [...data.events].filter(e => !e.date || e.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(0, 3);
  const importantDocs = data.documents.filter(d => d.important).slice(0, 3);
  return (
    <>
      {urgent && <div className="notice-strip"><strong>{urgent.urgency}:</strong> {urgent.title} - {urgent.message}</div>}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Official public school website</p>
          <h1>Welcome to Deo Gloria Primary School</h1>
          <p>Welcome to Deo Gloria Primary School, a public primary school serving learners and families in Regorogile, Spitskop, Thabazimbi and surrounding communities in Limpopo.</p>
          <h2>{data.settings.slogan}</h2>
          <div className="hero-actions">
            <button onClick={() => go("admissions")}>Admissions</button>
            <button onClick={() => go("news")} className="secondary">Announcements</button>
            <button onClick={() => go("contact")} className="secondary">Contact Us</button>
          </div>
        </div>
        <div className="hero-panel" aria-label="School information dashboard">
          <p>School Office</p><strong>{data.settings.telephone}</strong>
          <p>Address</p><strong>{data.settings.address}</strong>
          <p>Grades</p><strong>{data.settings.grades}</strong>
        </div>
      </section>
      <section className="section dashboard-home">
        <Intro eyebrow="School communication dashboard" title="Quick updates for parents, learners and staff" text="Deo Gloria Primary School is committed to quality teaching, learner support, discipline, respect and community involvement. The website helps the school communicate faster and keep notices organised." />
        <div className="dashboard-grid">
          <AutoCard title="Latest notices" items={latest.map(a => `${formatDate(a.date)} - ${a.title}`)} action="View notices" onClick={() => go("news")} />
          <AutoCard title="Upcoming events" items={upcoming.map(e => `${formatDate(e.date)} - ${e.title}`)} action="View calendar" onClick={() => go("calendar")} />
          <AutoCard title="Important documents" items={importantDocs.map(d => d.title)} action="Open documents" onClick={() => go("downloads")} />
        </div>
        <div className="quick-links">
          {["Parents", "Learners", "Teachers", "Documents"].map(label => <button key={label} onClick={() => go(label === "Documents" ? "downloads" : label.toLowerCase())}>{label}</button>)}
        </div>
      </section>
    </>
  );
}

function AutoCard({ title, items, action, onClick }) {
  return <article className="auto-card"><h3>{title}</h3>{items.length ? items.map((item, i) => <p key={i}>{item}</p>) : <p>Updates will appear here.</p>}<button onClick={onClick}>{action}</button></article>;
}

function Intro({ eyebrow, title, text }) {
  return <div className="intro"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function About({ data }) {
  const values = ["Respect", "Discipline", "Responsibility", "Excellence", "Ubuntu", "Honesty", "Care"];
  return <section className="section"><Intro eyebrow="About us" title="A public primary school serving Thabazimbi families" text="Deo Gloria Primary School is a public ordinary primary school located in Thabazimbi, Limpopo. The school serves learners from Regorogile, Spitskop and nearby communities. It focuses on quality basic education, learner discipline, academic improvement, safety and parental involvement." /><div className="two-column"><Card title="Vision" text="To develop responsible, disciplined and confident learners who are prepared for lifelong learning and positive contribution to society." /><Card title="Mission" text="To provide quality CAPS-aligned teaching and learning in a safe, inclusive and supportive school environment." /></div><div className="tag-list">{values.map(v => <span key={v}>{v}</span>)}</div><Card title="Principal's message" text="The principal's official message will be added after approval by school management." /><Card title="School history" text="The detailed history of Deo Gloria Primary School will be added after confirmation by school management." /></section>;
}

function Academics() {
  const groups = [
    ["Foundation Phase", ["Home Language", "First Additional Language", "Mathematics", "Life Skills"]],
    ["Intermediate Phase", ["Home Language", "First Additional Language", "Mathematics", "Natural Sciences and Technology", "Social Sciences", "Life Skills"]],
    ["Senior Phase, Grade 7", ["Home Language", "First Additional Language", "Mathematics", "Natural Sciences", "Technology", "Social Sciences", "Economic and Management Sciences", "Life Orientation", "Creative Arts"]]
  ];
  return <section className="section"><Intro eyebrow="Academics" title="CAPS-aligned teaching from Grade R to Grade 7" text="Deo Gloria Primary School encourages learners, parents and teachers to work together to improve academic performance." />{groups.map(([title, items]) => <ListCard key={title} title={title} items={items} />)}<Card title="Academic support" text="The school supports assessment preparation, homework routines, reading, numeracy improvement and learner intervention. Subjects must be confirmed with the school's official timetable and CAPS documents." /></section>;
}

function Admissions({ data, setData }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", grade: "Grade R", currentSchool: "", message: "", consent: false });
  const [note, setNote] = useState("");
  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.consent) return setNote("Please complete your name, phone number and POPIA consent.");
    setData({ ...data, admissions: [{ ...form, id: Date.now(), date: new Date().toISOString().slice(0, 10), status: "New" }, ...data.admissions] });
    setForm({ name: "", phone: "", email: "", grade: "Grade R", currentSchool: "", message: "", consent: false });
    setNote("Thank you. Deo Gloria Primary School has received your enquiry and will contact you.");
  }
  return <section className="section"><Intro eyebrow="Admissions" title="Admissions at Deo Gloria Primary School" text="Visit the school office, ask for the official admission application form, attach the required documents, submit the form and wait for confirmation from the school." /><ListCard title="Documents needed" items={["Learner birth certificate", "Parent/guardian ID copy", "Proof of residence", "Immunisation card / clinic card where applicable", "Transfer card or last school report if applicable", "Permit or refugee/asylum documentation where applicable"]} /><ManagedForm title="Admissions enquiry" form={form} setForm={setForm} submit={submit} note={note} fields={["name", "phone", "email", "grade", "currentSchool", "message"]} /></section>;
}

function Parents({ data }) {
  return <section className="section"><Intro eyebrow="Parents" title="Clear communication for families" text="Parents must use official school communication channels. Urgent matters must be directed to the school office. Respectful communication is expected at all times." /><ListCard title="Parent involvement" items={["Attend meetings", "Support homework", "Encourage reading", "Communicate with teachers", "Support school rules and discipline"]} /><Card title="School fees" text="Deo Gloria Primary School is listed as a Quintile 1 public school. School fee information must be confirmed annually with the school and School Governing Body." /><Downloads data={data} compact /></section>;
}

function Learners() {
  return <section className="section"><Intro eyebrow="Learners" title="Safe, respectful and supported learners" text="Every learner deserves to feel safe, respected and supported." /><ListCard title="Learner support" items={["Homework support", "Study tips", "School rules", "Reading corner", "Learner achievements"]} /><Card title="Anti-bullying message" text="Bullying is not accepted at Deo Gloria Primary School. Learners must report bullying to a teacher, class teacher, HOD, deputy principal or principal." /></section>;
}

function Teachers() {
  return <section className="section"><Intro eyebrow="Teachers" title="A simple area for staff resources" text="Internal school files can be connected to a real database, Google Drive, Google Sheets, Firebase, Supabase or school admin system later." /><ListCard title="Staff resources" items={["Staff notices", "Subject resources", "CAPS resources", "Assessment plans", "Departmental moderation", "School-based moderation tools", "Professional development", "ATP and subject file documents"]} /></section>;
}

function Announcements({ data }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const items = sortedByDate(data.announcements).filter(a => (filter === "All" || a.category === filter) && JSON.stringify(a).toLowerCase().includes(q.toLowerCase()));
  return <section className="section"><Intro eyebrow="Announcements / News" title="Latest school notices" /><SearchBar q={q} setQ={setQ} filter={filter} setFilter={setFilter} options={["All", ...categories.announcement]} /> <div className="card-grid">{items.map(a => <article className={`card urgency-${a.urgency.toLowerCase()}`} key={a.id}><small>{formatDate(a.date)} | {a.category} | {a.audience}</small><h3>{a.title}</h3><p>{a.message}</p><strong>{a.urgency}</strong></article>)}</div></section>;
}

function Calendar({ data }) {
  const [filter, setFilter] = useState("All");
  const items = [...data.events].sort((a, b) => String(a.date).localeCompare(String(b.date))).filter(e => filter === "All" || e.category === filter);
  return <section className="section"><Intro eyebrow="Calendar" title="Automated school calendar" /><SearchBar filter={filter} setFilter={setFilter} options={["All", ...categories.event]} /> <div className="card-grid">{items.map(e => <article className="card" key={e.id}><small>{formatDate(e.date)} | {e.time} | {e.audience}</small><h3>{e.title}</h3><p>{e.description}</p><p><strong>Venue:</strong> {e.venue}</p></article>)}</div></section>;
}

function Downloads({ data, compact = false }) {
  const groups = categories.documents.map(cat => [cat, data.documents.filter(d => d.category === cat)]).filter(([, docs]) => docs.length);
  return <section className={compact ? "" : "section"}>{!compact && <Intro eyebrow="Downloads" title="School documents" text="Upload approved PDF documents here when they are confirmed by school management." />}{groups.map(([cat, docs]) => <div className="document-group" key={cat}><h3>{cat}</h3>{docs.map(doc => <a key={doc.id} className="document-link" href={doc.link || "#"}><span><strong>{doc.title}</strong><small>{doc.description}</small></span><em>PDF</em></a>)}</div>)}</section>;
}

function FAQ({ data }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const items = data.faqs.filter(f => (filter === "All" || f.category === filter) && JSON.stringify(f).toLowerCase().includes(q.toLowerCase()));
  return <section className="section"><Intro eyebrow="FAQ" title="Frequently asked questions" /><SearchBar q={q} setQ={setQ} filter={filter} setFilter={setFilter} options={["All", ...categories.faq]} />{items.map(f => <details className="faq" key={f.id}><summary>{f.question}</summary><p>{f.answer}</p><small>{f.category}</small></details>)}</section>;
}

function Gallery() {
  return <section className="section"><Intro eyebrow="Gallery" title="Approved school photo gallery" text="Only approved photos with written parental consent may be published. Placeholder images are used until school management approves real images." /><div className="gallery-grid">{["Events", "Awards", "Sports", "Classroom Activities", "Community Projects"].map(item => <div className="placeholder" key={item}>{item}</div>)}</div></section>;
}

function Contact({ data, setData }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", type: "General", message: "", consent: false });
  const [note, setNote] = useState("");
  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.message || !form.consent) return setNote("Please complete your name, message and POPIA consent.");
    setData({ ...data, messages: [{ ...form, id: Date.now(), date: new Date().toISOString().slice(0, 10), status: "New" }, ...data.messages] });
    setForm({ name: "", phone: "", email: "", type: "General", message: "", consent: false });
    setNote("Thank you. Your message has been received by Deo Gloria Primary School.");
  }
  return <section className="section"><Intro eyebrow="Contact" title={data.settings.schoolName} text={`${data.settings.address}. Telephone: ${data.settings.telephone}. Alternative number: ${data.settings.alternativeTelephone}. Email: ${data.settings.email}.`} /><div className="map-placeholder">Google Maps placeholder - confirm location with school management</div><ManagedForm title="Contact the school" form={form} setForm={setForm} submit={submit} note={note} fields={["name", "phone", "email", "type", "message"]} /></section>;
}

function Privacy() {
  return <section className="section"><Intro eyebrow="POPIA Privacy Notice" title="Protecting personal information" text="Deo Gloria Primary School processes personal information only for school administration, communication, admissions and learner support purposes." /><ListCard title="Privacy commitments" items={["The school collects personal information only for school administration, admissions, communication and learner support.", "Children's personal information must be protected.", "Learner photos and names may only be published with proper consent.", "Parents and guardians may contact the school to update or correct personal information.", "The website contact form must not ask for unnecessary personal information.", "Do not publish learner names, ID numbers, reports, medical information, addresses or private information without written consent."]} /></section>;
}

function ManagedForm({ title, form, setForm, submit, note, fields }) {
  return <form className="managed-form" onSubmit={submit}><h3>{title}</h3><p className="privacy-note">POPIA notice: Deo Gloria Primary School processes personal information only for school administration, communication, admissions and learner support purposes.</p>{fields.map(field => <label key={field}>{fieldLabel(field)}{field === "message" ? <textarea value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} /> : field === "type" ? <select value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}>{categories.enquiry.map(x => <option key={x}>{x}</option>)}</select> : field === "grade" ? <select value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}>{["Grade R", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7"].map(x => <option key={x}>{x}</option>)}</select> : <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />}</label>)}<label className="check"><input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} /> I consent to Deo Gloria Primary School processing my personal information for the purpose of responding to my enquiry.</label><button type="submit">Submit enquiry</button>{note && <p className="form-note">{note}</p>}</form>;
}

function fieldLabel(field) {
  return { name: "Name", phone: "Phone number", email: "Email", grade: "Learner grade applying for", currentSchool: "Learner current school, if applicable", type: "Enquiry type", message: "Message" }[field] || field;
}

function Admin({ data, setData }) {
  const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("deoAdmin") === "yes");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("Announcements");
  if (!loggedIn) return <section className="section admin-login"><Intro eyebrow="Admin / CMS" title="Password protected school dashboard" text="School staff can update notices, events, documents, FAQs and website settings here." /><form onSubmit={e => { e.preventDefault(); if (password === ADMIN_PASSWORD) { sessionStorage.setItem("deoAdmin", "yes"); setLoggedIn(true); } }}><label>Admin password<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label><button>Login</button><p className="privacy-note">Demo password: DeoGloria@2026. Connect a real backend before official use.</p></form></section>;
  const tabs = ["Overview", "Announcements", "Calendar Events", "Admissions Enquiries", "Contact Messages", "Documents", "FAQs", "Website Settings"];
  return <section className="section admin"><Intro eyebrow="Admin / CMS" title="School content management dashboard" text="Changes saved here update the public homepage automatically in this browser. Connect a secure database later for official multi-user use." /><div className="admin-tabs">{tabs.map(t => <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>{tab === "Overview" && <AdminOverview data={data} />}{tab === "Announcements" && <Crud title="Announcements" items={data.announcements} fields={["title", "date", "category", "message", "audience", "urgency"]} options={{ category: categories.announcement, audience: categories.audience, urgency: categories.urgency }} onChange={items => setData({ ...data, announcements: items })} />}{tab === "Calendar Events" && <Crud title="Calendar Events" items={data.events} fields={["title", "date", "time", "venue", "description", "audience", "category"]} options={{ audience: categories.audience, category: categories.event }} onChange={items => setData({ ...data, events: items })} />}{tab === "Documents" && <Crud title="Documents" items={data.documents} fields={["title", "description", "category", "link", "important"]} options={{ category: categories.documents }} onChange={items => setData({ ...data, documents: items })} />}{tab === "FAQs" && <Crud title="FAQs" items={data.faqs} fields={["question", "answer", "category"]} options={{ category: categories.faq }} onChange={items => setData({ ...data, faqs: items })} />}{tab === "Admissions Enquiries" && <Inbox items={data.admissions} onChange={items => setData({ ...data, admissions: items })} />}{tab === "Contact Messages" && <Inbox items={data.messages} onChange={items => setData({ ...data, messages: items })} />}{tab === "Website Settings" && <Settings settings={data.settings} onChange={settings => setData({ ...data, settings })} />}</section>;
}

function AdminOverview({ data }) {
  return <div className="dashboard-grid"><AutoCard title="Homepage automation" items={["Urgent notices update the alert bar", "Latest notices update the homepage", "Upcoming events update the homepage"]} action="Active" /><AutoCard title="Content to manage" items={[`${data.announcements.length} announcements`, `${data.events.length} calendar events`, `${data.documents.length} documents`, `${data.faqs.length} FAQs`]} action="Local CMS" /><AutoCard title="Messages" items={[`${data.admissions.length} admissions enquiries`, `${data.messages.length} contact messages`, "Statuses can be updated by staff"]} action="Review inbox" /></div>;
}

function Crud({ title, items, fields, options = {}, onChange }) {
  const empty = Object.fromEntries(fields.map(f => [f, f === "date" ? new Date().toISOString().slice(0, 10) : f === "important" ? false : ""]));
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const filterField = fields.find(f => options[f]);
  const shown = items.filter(item => (filter === "All" || !filterField || item[filterField] === filter) && JSON.stringify(item).toLowerCase().includes(q.toLowerCase()));
  function submit(e) {
    e.preventDefault();
    if (fields.some(f => f !== "important" && f !== "link" && !String(form[f] || "").trim())) return alert("Please complete all required fields.");
    const next = editing ? items.map(item => item.id === editing ? { ...form, id: editing } : item) : [{ ...form, id: nextId(items) }, ...items];
    onChange(next);
    setEditing(null); setForm(empty);
  }
  function remove(id) {
    if (confirm("Delete this item? This cannot be undone.")) onChange(items.filter(item => item.id !== id));
  }
  return <div className="admin-panel"><h3>{title}</h3><SearchBar q={q} setQ={setQ} filter={filter} setFilter={setFilter} options={["All", ...(filterField ? options[filterField] : [])]} /><form className="admin-form" onSubmit={submit}>{fields.map(f => <label key={f}>{fieldLabel(f)}{f === "message" || f === "description" || f === "answer" ? <textarea value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} /> : f === "important" ? <input type="checkbox" checked={!!form[f]} onChange={e => setForm({ ...form, [f]: e.target.checked })} /> : options[f] ? <select value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}><option value="">Select</option>{options[f].map(x => <option key={x}>{x}</option>)}</select> : <input type={f === "date" ? "date" : "text"} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />}</label>)}<button>{editing ? "Save changes" : "Add item"}</button>{editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setForm(empty); }}>Cancel edit</button>}</form><div className="admin-list">{shown.map(item => <article key={item.id}><strong>{item.title || item.question || item.name}</strong><small>{item.category || item.type || item.status}</small><p>{item.message || item.description || item.answer}</p><button onClick={() => { setEditing(item.id); setForm(item); }}>Edit</button><button className="danger" onClick={() => remove(item.id)}>Delete</button></article>)}</div></div>;
}

function Inbox({ items, onChange }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const shown = items.filter(item => (filter === "All" || item.status === filter) && JSON.stringify(item).toLowerCase().includes(q.toLowerCase()));
  return <div className="admin-panel"><h3>Messages and enquiries</h3><SearchBar q={q} setQ={setQ} filter={filter} setFilter={setFilter} options={["All", ...categories.status]} /><div className="admin-list">{shown.map(item => <article key={item.id}><strong>{item.name}</strong><small>{item.date} | {item.type || item.grade}</small><p>{item.message}</p><select value={item.status} onChange={e => onChange(items.map(x => x.id === item.id ? { ...x, status: e.target.value } : x))}>{categories.status.map(x => <option key={x}>{x}</option>)}</select><button className="danger" onClick={() => confirm("Delete this message?") && onChange(items.filter(x => x.id !== item.id))}>Delete</button></article>)}</div></div>;
}

function Settings({ settings, onChange }) {
  return <div className="admin-panel"><h3>Website settings</h3><div className="admin-form">{Object.keys(settings).map(key => <label key={key}>{key}<input value={settings[key]} onChange={e => onChange({ ...settings, [key]: e.target.value })} /></label>)}</div></div>;
}

function SearchBar({ q, setQ, filter, setFilter, options = [] }) {
  return <div className="tools">{setQ && <input placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />}{setFilter && <select value={filter} onChange={e => setFilter(e.target.value)}>{options.map(x => <option key={x}>{x}</option>)}</select>}</div>;
}

function Card({ title, text }) { return <article className="card"><h3>{title}</h3><p>{text}</p></article>; }
function ListCard({ title, items }) { return <article className="card"><h3>{title}</h3><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></article>; }

function Footer({ settings, go }) {
  return <footer><strong>{settings.schoolName}</strong><p>EMIS: {settings.emis} | {settings.address} | {settings.telephone}</p><button onClick={() => go("privacy")}>Privacy notice</button><p>Copyright {new Date().getFullYear()} Deo Gloria Primary School. All rights reserved.</p></footer>;
}

function WhatsAppButton({ number }) {
  const text = encodeURIComponent("Good day Deo Gloria Primary School. I would like to enquire about:");
  return <a className="whatsapp" href={`https://wa.me/${number}?text=${text}`} aria-label="WhatsApp enquiry">WhatsApp<span>Please do not send learner ID numbers, medical details or private documents through WhatsApp unless requested by the school.</span></a>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
