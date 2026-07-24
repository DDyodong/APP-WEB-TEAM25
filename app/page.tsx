"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { ui } from "./i18n";

type Tab = "work" | "tbm" | "check" | "report" | "profile";

const languages = [
  ["ko", "한국어", "ko-KR"],
  ["en", "English", "en-US"],
  ["vi", "Tiếng Việt", "vi-VN"],
  ["zh", "中文", "zh-CN"],
  ["ne", "नेपाली", "ne-NP"],
  ["uz", "Oʻzbekcha", "uz-UZ"],
  ["si", "සිංහල", "si-LK"],
  ["ta", "தமிழ்", "ta-IN"],
  ["id", "Bahasa Indonesia", "id-ID"],
  ["th", "ภาษาไทย", "th-TH"],
  ["fil", "Filipino", "fil-PH"],
  ["my", "မြန်မာဘာသာ", "my-MM"],
] as const;

const tbmByLanguage: Record<string, { title: string; content: string }> = {
  ko: {
    title: "고소 작업 및 배관 조립 안전 안내",
    content:
      "작업 전 안전모와 안전화를 올바르게 착용해 주세요. 고소 작업 시 안전벨트를 이중으로 체결하고, 작업구역 하부의 출입 통제 상태를 확인합니다. 위험 상황을 발견하면 즉시 작업을 중지하고 앱으로 신고해 주세요.",
  },
  en: {
    title: "Height work and pipe assembly safety briefing",
    content:
      "Before work, wear your safety helmet and safety shoes correctly. For work at height, fasten the safety harness twice and check access control below the work area. If you find a hazard, stop work immediately and report it through the app.",
  },
  vi: {
    title: "Hướng dẫn an toàn làm việc trên cao và lắp ráp đường ống",
    content:
      "Trước khi làm việc, hãy đội mũ bảo hộ và mang giày bảo hộ đúng cách. Khi làm việc trên cao, hãy móc dây an toàn hai điểm và kiểm tra việc kiểm soát ra vào bên dưới khu vực làm việc.",
  },
  zh: {
    title: "高处作业及管道装配安全说明",
    content:
      "作业前请正确佩戴安全帽和安全鞋。进行高处作业时，请双重固定安全带，并确认作业区域下方的出入管制状态。发现危险时，请立即停止作业并通过应用程序报告。",
  },
  ne: {
    title: "उचाइमा काम र पाइप जडान सुरक्षा निर्देशन",
    content:
      "काम सुरु गर्नु अघि सुरक्षा हेल्मेट र सुरक्षा जुत्ता सही तरिकाले लगाउनुहोस्। उचाइमा काम गर्दा सुरक्षा बेल्ट दुई ठाउँमा बाँध्नुहोस् र कार्यक्षेत्र मुनिको प्रवेश नियन्त्रण जाँच गर्नुहोस्।",
  },
  uz: {
    title: "Balandlikda ishlash va quvur yig‘ish xavfsizlik yo‘riqnomasi",
    content:
      "Ish boshlashdan oldin himoya kaskasi va xavfsizlik poyabzalini to‘g‘ri kiying. Balandlikda ishlaganda xavfsizlik kamarini ikki nuqtaga mahkamlang.",
  },
  si: {
    title: "උස ස්ථාන වැඩ සහ නළ එකලස් කිරීමේ ආරක්ෂක උපදෙස්",
    content:
      "වැඩ ආරම්භ කිරීමට පෙර ආරක්ෂක හිස්වැස්ම සහ ආරක්ෂක පාවහන් නිවැරදිව පැළඳ ගන්න. උස ස්ථානයක වැඩ කරන විට ආරක්ෂක පටිය ස්ථාන දෙකකට සවි කරන්න.",
  },
  ta: {
    title: "உயரப் பணி மற்றும் குழாய் பொருத்தும் பாதுகாப்பு அறிவுரை",
    content:
      "வேலையைத் தொடங்கும் முன் பாதுகாப்புத் தலைக்கவசம் மற்றும் பாதுகாப்புக் காலணிகளைச் சரியாக அணியுங்கள். உயரத்தில் பணிபுரியும் போது பாதுகாப்புப் பட்டையை இரண்டு இடங்களில் இணைக்கவும்.",
  },
  id: {
    title: "Panduan keselamatan kerja di ketinggian dan perakitan pipa",
    content:
      "Sebelum bekerja, kenakan helm keselamatan dan sepatu keselamatan dengan benar. Saat bekerja di ketinggian, kaitkan sabuk keselamatan pada dua titik.",
  },
  th: {
    title: "คำแนะนำความปลอดภัยงานบนที่สูงและงานประกอบท่อ",
    content:
      "ก่อนเริ่มงาน โปรดสวมหมวกนิรภัยและรองเท้านิรภัยให้ถูกต้อง เมื่อต้องทำงานบนที่สูง ให้ยึดสายรัดนิรภัยสองจุด",
  },
  fil: {
    title: "Gabay sa kaligtasan sa matataas na lugar at pagbuo ng tubo",
    content:
      "Bago magtrabaho, isuot nang tama ang safety helmet at safety shoes. Kapag nagtatrabaho sa mataas na lugar, ikabit ang safety harness sa dalawang punto.",
  },
  my: {
    title: "အမြင့်နေရာလုပ်ငန်းနှင့် ပိုက်တပ်ဆင်ရေး ဘေးကင်းလုံခြုံမှု လမ်းညွှန်",
    content:
      "အလုပ်မစမီ ဘေးကင်းရေးဦးထုပ်နှင့် ဘေးကင်းရေးဖိနပ်ကို မှန်ကန်စွာ ဝတ်ဆင်ပါ။ အမြင့်တွင် အလုပ်လုပ်သည့်အခါ ဘေးကင်းရေးခါးပတ်ကို နေရာနှစ်ခုတွင် ချိတ်ဆက်ပါ။",
  },
};

const tabs: Tab[] = ["work", "tbm", "check", "report", "profile"];
const tabIcons = ["⌂", "▶", "✓", "!", "♙"];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="info-row"><span>{label}</span><b>{value}</b></div>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("work");
  const [language, setLanguage] = useState("ko");
  const [tbmDone, setTbmDone] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [photo, setPhoto] = useState("");
  const [checks, setChecks] = useState([false, false, false]);
  const [ppeState, setPpeState] = useState<"idle" | "loading" | "done">("idle");
  const [reportPhoto, setReportPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [reports, setReports] = useState(0);
  const [toast, setToast] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const currentLanguage = useMemo(
    () => languages.find(([code]) => code === language) ?? languages[0],
    [language],
  );
  const t = ui[language] ?? ui.ko;
  const briefing = tbmByLanguage[language] ?? tbmByLanguage.ko;

  useEffect(() => {
    const saved = localStorage.getItem("smartyard-language");
    if (saved && tbmByLanguage[saved]) setLanguage(saved);
    return () => window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [tab]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2300);
    return () => clearTimeout(timer);
  }, [toast]);

  const openPhoto = (
    event: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setter(URL.createObjectURL(file));
    if (setter === setPhoto) setPpeState("idle");
  };

  const speak = () => {
    if (!("speechSynthesis" in window)) {
      setToast(t.speechUnsupported);
      return;
    }
    window.speechSynthesis.cancel();
    const message = new SpeechSynthesisUtterance(briefing.content);
    message.lang = currentLanguage[2];
    message.rate = 0.92;
    message.onend = () => setSpeaking(false);
    message.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(message);
    setSpeaking(true);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const submitPpe = () => {
    if (!photo) return setToast(t.photoRequired);
    if (!checks.every(Boolean)) return setToast(t.manualRequired);
    setPpeState("loading");
    setTimeout(() => {
      setPpeState("done");
      setToast(t.ppeToast);
    }, 1300);
  };

  const submitReport = () => {
    if (!reportPhoto) return setToast(t.reportPhotoRequired);
    if (!description.trim()) return setToast(t.reportDetailRequired);
    setReports((value) => value + 1);
    setDescription("");
    setReportPhoto("");
    setToast(t.reportToast);
  };

  const renderWork = () => (
    <>
      <Card className="work-card">
        <strong className="approved">{t.approved}</strong>
        <h2>{t.workTitle}</h2>
        <p className="muted">PTW-DEMO-001 · {t.block}</p>
        <div className="info-list">
          <InfoRow label={t.workTime} value="08:00 - 17:00" />
          <InfoRow label={t.workType} value={t.piping} />
          <InfoRow label={t.siteRisk} value={t.highRisk} />
        </div>
      </Card>

      <Card>
        <h3 className="cyan">{t.requiredConditions}</h3>
        <p className="condition-copy">{t.conditions}</p>
      </Card>

      <div className="section-head">
        <h3>{t.beforeWork}</h3>
        <span>{t.completeInOrder}</span>
      </div>
      <button className="action-card" onClick={() => setTab("tbm")}>
        <i className={tbmDone ? "complete" : ""}>{tbmDone ? "✓" : "1"}</i>
        <span><b>{t.tbmListen}</b><small>{tbmDone ? t.confirmed : t.listenAndConfirm}</small></span>
        <em>›</em>
      </button>
      <button className="action-card" onClick={() => setTab("check")}>
        <i className={ppeState === "done" ? "complete" : ""}>{ppeState === "done" ? "✓" : "2"}</i>
        <span><b>{t.ppeCheck}</b><small>{ppeState === "done" ? t.analysisComplete : t.photoPpeCheck}</small></span>
        <em>›</em>
      </button>
      <button className="danger-button" onClick={() => setTab("report")}>{t.reportHazard}</button>
    </>
  );

  const renderTbm = () => (
    <>
      <Card className="tbm-card">
        <h2>{briefing.title}</h2>
        <p className="muted">{t.tbmInstruction}</p>
        <p className="briefing-copy">{briefing.content}</p>
        <div className="two-buttons">
          <button className={`outline-button cyan-text ${speaking ? "playing" : ""}`} onClick={speak}>
            {speaking ? `● ${t.listen.replace(/^▶\s*/, "")}` : t.listen}
          </button>
          <button className="outline-button" onClick={stopSpeaking}>{t.stop}</button>
        </div>
      </Card>
      <button
        className={`primary-button ${tbmDone ? "disabled" : ""}`}
        disabled={tbmDone}
        onClick={() => {
          setTbmDone(true);
          setToast(t.tbmToast);
        }}
      >
        {tbmDone ? t.tbmDone : t.reviewed}
      </button>
    </>
  );

  const renderCheck = () => (
    <>
      {ppeState === "done" && <div className="status-card">{t.ppeDone}</div>}
      <Card>
        <h3>{t.aiTitle}</h3>
        <p className="muted guide">{t.aiGuide}</p>
      </Card>
      <label className={`photo-preview ${photo ? "has-photo" : ""}`}>
        {photo ? <img src={photo} alt={t.ppePhoto} /> : <><span>▣</span><b>{t.ppePhoto}</b></>}
        <input type="file" accept="image/*" capture="environment" onChange={(e) => openPhoto(e, setPhoto)} />
      </label>
      <div className="two-buttons">
        <label className="outline-button file-button">{t.camera}<input type="file" accept="image/*" capture="environment" onChange={(e) => openPhoto(e, setPhoto)} /></label>
        <label className="outline-button file-button">{t.gallery}<input type="file" accept="image/*" onChange={(e) => openPhoto(e, setPhoto)} /></label>
      </div>
      <div className="section-head">
        <h3>{t.manualItems}</h3><span>{t.unsupported}</span>
      </div>
      {t.manualChecks.map((label, index) => (
        <label className="check-row" key={label}>
          <input
            type="checkbox"
            checked={checks[index]}
            onChange={() => setChecks(checks.map((value, i) => i === index ? !value : value))}
          />
          <span>{label}</span>
        </label>
      ))}
      {ppeState === "done" && (
        <Card className="result-card">
          <h3 className="green">{t.aiPass}</h3>
          <InfoRow label={t.helmet} value={`${t.worn} · 97%`} />
          <InfoRow label={t.harness} value={t.worn} />
          <InfoRow label={t.weldingMask} value={t.worn} />
          <InfoRow label={t.model} value="DEMO-YOLO" />
        </Card>
      )}
      <button className="primary-button" onClick={submitPpe}>
        {ppeState === "loading" ? t.analyzing : t.submitPpe}
      </button>
    </>
  );

  const renderReport = () => (
    <>
      <Card>
        <h3>{t.reportTitle}</h3>
        <p className="muted guide">{t.reportGuide}</p>
        <label className="field-label">{t.riskType}</label>
        <select className="field">
          {t.risks.map((risk) => <option key={risk}>{risk}</option>)}
        </select>
      </Card>
      <label className={`photo-preview report-photo ${reportPhoto ? "has-photo" : ""}`}>
        {reportPhoto ? <img src={reportPhoto} alt={t.hazardPhoto} /> : <><span>▣</span><b>{t.hazardPhoto}</b></>}
        <input type="file" accept="image/*" capture="environment" onChange={(e) => openPhoto(e, setReportPhoto)} />
      </label>
      <div className="two-buttons">
        <label className="outline-button file-button">{t.camera}<input type="file" accept="image/*" capture="environment" onChange={(e) => openPhoto(e, setReportPhoto)} /></label>
        <label className="outline-button file-button">{t.gallery}<input type="file" accept="image/*" onChange={(e) => openPhoto(e, setReportPhoto)} /></label>
      </div>
      <textarea
        className="field textarea"
        value={description}
        placeholder={t.reportHint}
        onChange={(event) => setDescription(event.target.value)}
      />
      <button className="danger-button" onClick={submitReport}>{t.submitReport}</button>
      <div className="section-head"><h3>{t.myReports}</h3><span>{t.count(reports)}</span></div>
      {reports === 0 ? (
        <div className="empty-card">{t.noReports}</div>
      ) : (
        <Card className="report-record">
          <div><b>DEMO-{String(reports).padStart(3, "0")}</b><span>{t.received}</span></div>
          <h3>{t.reportRecord}</h3>
          <p className="muted">{t.justNow} · {description || t.reportToast}</p>
        </Card>
      )}
    </>
  );

  const renderProfile = () => (
    <>
      <Card className="profile-card">
        <div className="profile-mark">{t.demoWorker.slice(0, 1)}</div>
        <h2>{t.demoWorker}</h2>
        <p className="muted">{t.worker} · {t.demo}</p>
        <InfoRow label={t.permissions} value={t.permissionsValue} />
      </Card>
      <Card>
        <h3>{t.appLanguage}</h3>
        <p className="muted guide">{t.appLanguageGuide}</p>
        <select
          className="field language-select"
          value={language}
          onChange={(event) => {
            const nextLanguage = event.target.value;
            setLanguage(nextLanguage);
            localStorage.setItem("smartyard-language", nextLanguage);
            setToast(ui[nextLanguage]?.languageToast ?? ui.ko.languageToast);
          }}
        >
          {languages.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      </Card>
      <button className="outline-button full-button" onClick={() => setToast(t.logoutToast)}>{t.logout}</button>
      <p className="server-caption">{t.serverCaption}</p>
    </>
  );

  return (
    <main className="web-stage">
      <section className="phone-app" aria-label={`${t.worker} ${t.demo}`}>
        <header className="app-header">
          <div>
            <h1>{t.pages[tabs.indexOf(tab)]}</h1>
            <p>{t.demoWorker} · {t.worker} · <span>{t.demo}</span></p>
          </div>
          <div className="avatar">{t.demoWorker.slice(0, 1)}</div>
        </header>

        <div className="screen-content" ref={contentRef}>
          {tab === "work" && renderWork()}
          {tab === "tbm" && renderTbm()}
          {tab === "check" && renderCheck()}
          {tab === "report" && renderReport()}
          {tab === "profile" && renderProfile()}
          <div className="scroll-tail" />
        </div>

        <nav className="bottom-nav">
          {tabs.map((key, index) => (
            <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
              <span>{tabIcons[index]}</span>
              <b>{t.nav[index]}</b>
            </button>
          ))}
        </nav>
        {toast && <div className="toast">{toast}</div>}
      </section>
    </main>
  );
}
