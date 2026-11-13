
/* =================================
   QAVELYNT AI CORE
   One Intelligence - 45 Experts
================================= */

const QAVELYNT_AI = (() => {

  const experts = [
    "Technology",
    "Programming",
    "Artificial Intelligence",
    "Cybersecurity",
    "Engineering",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Medicine",
    "Health",
    "Psychology",
    "Education",
    "Mathematics",
    "Astronomy",
    "Space Science",
    "Business",
    "Economics",
    "Finance",
    "Marketing",
    "Entrepreneurship",
    "Law",
    "Politics",
    "History",
    "Geography",
    "Philosophy",
    "Literature",
    "Writing",
    "Art",
    "Graphic Design",
    "Architecture",
    "Music",
    "Film",
    "Photography",
    "Sports",
    "Nutrition",
    "Environment",
    "Agriculture",
    "Robotics",
    "Electronics",
    "Communication",
    "Languages",
    "Research",
    "Innovation",
    "Project Management"
  ];

  function getExperts() {
    return experts.map((name, index) => ({
      id: index + 1,
      name,
      active: true
    }));
  }

  function findExperts(topic) {
    const query = String(topic || "").toLowerCase();

    return getExperts().filter(expert =>
      expert.name.toLowerCase().includes(query)
    );
  }

  function createTeam(expertIds = []) {
    return getExperts().filter(expert =>
      expertIds.includes(expert.id)
    );
  }

  function getSystemInfo() {
    return {
      name: "QAVELYNT AI",
      version: "1.0.0",
      totalExperts: experts.length,
      architecture: "Central Intelligence Network",
      experts: getExperts()
    };
  }

  return {
    getExperts,
    findExperts,
    createTeam,
    getSystemInfo
  };

})();

window.QAVELYNT_AI = QAVELYNT_AI;
