
/* =========================================
   QAVELYNT AI SYSTEM
   One Intelligence - 45 Expert Network
   Version 1.0.0
========================================= */

const QAVELYNT = (() => {
  "use strict";

  const CONFIG = {
    name: "QAVELYNT AI",
    version: "1.0.0",
    apiEndpoint: "/api/ai",
    maxHistory: 30,
    maxExpertsPerTeam: 8
  };

  // 45 SPECIALISTS

  const EXPERTS = [
    ["Technology", ["technology", "tech", "فناوری", "تکنولوژی"]],
    ["Programming", ["code", "programming", "coding", "برنامه نویسی"]],
    ["Artificial Intelligence", ["ai", "artificial intelligence", "هوش مصنوعی"]],
    ["Cybersecurity", ["security", "cybersecurity", "امنیت"]],
    ["Engineering", ["engineering", "مهندسی"]],
    ["Science", ["science", "علوم"]],
    ["Physics", ["physics", "فیزیک"]],
    ["Chemistry", ["chemistry", "شیمی"]],
    ["Biology", ["biology", "زیست"]],
    ["Medicine", ["medicine", "medical", "پزشکی"]],
    ["Health", ["health", "سلامت"]],
    ["Psychology", ["psychology", "روانشناسی"]],
    ["Education", ["education", "آموزش"]],
    ["Mathematics", ["math", "mathematics", "ریاضی"]],
    ["Astronomy", ["astronomy", "نجوم"]],
    ["Space Science", ["space", "فضا"]],
    ["Business", ["business", "کسب و کار"]],
    ["Economics", ["economics", "اقتصاد"]],
    ["Finance", ["finance", "مالی"]],
    ["Marketing", ["marketing", "بازاریابی"]],
    ["Entrepreneurship", ["startup", "entrepreneurship", "استارتاپ"]],
    ["Law", ["law", "legal", "حقوق"]],
    ["Politics", ["politics", "سیاست"]],
    ["History", ["history", "تاریخ"]],
    ["Geography", ["geography", "جغرافیا"]],
    ["Philosophy", ["philosophy", "فلسفه"]],
    ["Literature", ["literature", "ادبیات"]],
    ["Writing", ["writing", "نویسندگی"]],
    ["Art", ["art", "هنر"]],
    ["Graphic Design", ["graphic design", "طراحی گرافیک"]],
    ["Architecture", ["architecture", "معماری"]],
    ["Music", ["music", "موسیقی"]],
    ["Film", ["film", "cinema", "سینما"]],
    ["Photography", ["photography", "عکاسی"]],
    ["Sports", ["sports", "sport", "ورزش"]],
    ["Nutrition", ["nutrition", "تغذیه"]],
    ["Environment", ["environment", "محیط زیست"]],
    ["Agriculture", ["agriculture", "کشاورزی"]],
    ["Robotics", ["robotics", "رباتیک"]],
    ["Electronics", ["electronics", "الکترونیک"]],
    ["Communication", ["communication", "ارتباطات"]],
    ["Languages", ["language", "languages", "زبان"]],
    ["Research", ["research", "تحقیق"]],
    ["Innovation", ["innovation", "نوآوری"]],
    ["Project Management", ["project management", "مدیریت پروژه"]]
  ].map(([name, keywords], index) => ({
    id: index + 1,
    name,
    keywords,
    active: true
  }));

  // CENTRAL INTELLIGENCE

  const conversations = new Map();

  function getExperts() {
    return EXPERTS.map(expert => ({ ...expert }));
  }

  function getExpert(id) {
    return EXPERTS.find(expert => expert.id === Number(id)) || null;
  }

  // AUTOMATIC EXPERT SELECTION

  function detectExperts(question, limit = 3) {
    const text = String(question || "").toLowerCase();

    const matches = EXPERTS.map(expert => {
      let score = 0;

      for (const keyword of expert.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          score += keyword.includes(" ") ? 3 : 2;
        }
      }

      return { expert, score };
    });

    return matches
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.expert);
  }

  // TEAM MANAGEMENT

  function createTeam(ids = []) {
    const uniqueIds = [...new Set(ids.map(Number))];

    return uniqueIds
      .slice(0, CONFIG.maxExpertsPerTeam)
      .map(getExpert)
      .filter(Boolean);
  }

  function buildTeam(question, selectedIds = []) {
    if (selectedIds.length) {
      return createTeam(selectedIds);
    }

    const detected = detectExperts(question);

    return detected.length
      ? detected
      : [getExpert(43)];
  }

  // CONVERSATION MANAGEMENT

  function getConversation(id = "default") {
    if (!conversations.has(id)) {
      conversations.set(id, []);
    }

    return conversations.get(id);
  }

  function addMessage(id, role, content) {
    const history = getConversation(id);

    history.push({
      role,
      content: String(content),
      timestamp: new Date().toISOString()
    });

    if (history.length > CONFIG.maxHistory) {
      history.splice(0, history.length - CONFIG.maxHistory);
    }

    return history;
  }

  function clearConversation(id = "default") {
    conversations.delete(id);
  }

  // REQUEST BUILDER

  function buildRequest(question, options = {}) {
    const conversationId = options.conversationId || "default";

    const team = buildTeam(
      question,
      options.expertIds || []
    );

    return {
      platform: CONFIG.name,
      version: CONFIG.version,
      conversationId,
      question: String(question).trim(),
      mode: team.length > 1 ? "collaborative" : "specialist",
      experts: team.map(expert => ({
        id: expert.id,
        specialty: expert.name
      })),
      history: getConversation(conversationId).map(message => ({
        role: message.role,
        content: message.content
      }))
    };
  }

  // REAL AI CONNECTION
  // Requires a secure backend server.

  async function ask(question, options = {}) {
    if (!String(question || "").trim()) {
      throw new Error("Please enter a question.");
    }

    const conversationId = options.conversationId || "default";

    const request = buildRequest(question, options);

    addMessage(conversationId, "user", question);

    let response;

    try {
      response = await fetch(CONFIG.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });
    } catch (error) {
      throw new Error(
        "AI server is not connected yet."
      );
    }

    if (!response.ok) {
      throw new Error(
        "AI server returned error " + response.status
      );
    }

    const data = await response.json();

    if (!data || typeof data.answer !== "string") {
      throw new Error("Invalid AI server response.");
    }

    addMessage(conversationId, "assistant", data.answer);

    return {
      answer: data.answer,
      experts: request.experts,
      mode: request.mode,
      conversationId
    };
  }

  // SYSTEM INFORMATION

  function getSystemInfo() {
    return {
      name: CONFIG.name,
      version: CONFIG.version,
      totalExperts: EXPERTS.length,
      activeExperts: EXPERTS.filter(e => e.active).length,
      maxTeamSize: CONFIG.maxExpertsPerTeam,
      status: "Frontend ready; backend required"
    };
  }

  return Object.freeze({
    getExperts,
    getExpert,
    detectExperts,
    createTeam,
    buildTeam,
    buildRequest,
    getConversation,
    addMessage,
    clearConversation,
    ask,
    getSystemInfo
  });

})();

window.QAVELYNT = QAVELYNT;
