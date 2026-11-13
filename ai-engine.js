
/* =====================================
   QAVELYNT AI ENGINE
   Central Expert Coordination Engine
===================================== */

const QAVELYNT_ENGINE = (() => {

  const CORE = window.QAVELYNT_AI;

  if (!CORE) {
    throw new Error("QAVELYNT AI CORE not found.");
  }

  const API_ENDPOINT = "/api/ai";

  function getAvailableExperts() {
    return CORE.getExperts();
  }

  function selectExperts(expertIds) {
    return CORE.createTeam(expertIds);
  }

  function buildRequest(question, expertIds) {
    const team = selectExperts(expertIds);

    return {
      platform: "QAVELYNT",
      question: String(question).trim(),
      experts: team.map(expert => ({
        id: expert.id,
        specialty: expert.name
      })),
      mode: team.length > 1
        ? "collaborative"
        : "specialist",
      version: "1.0.0"
    };
  }

  async function ask(question, expertIds = []) {

    if (!question || !String(question).trim()) {
      throw new Error("Please enter a question.");
    }

    const request = buildRequest(
      question,
      expertIds
    );

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(
        "AI server error: " + response.status
      );
    }

    return await response.json();
  }

  return {
    getAvailableExperts,
    selectExperts,
    buildRequest,
    ask
  };

})();

window.QAVELYNT_ENGINE = QAVELYNT_ENGINE;
