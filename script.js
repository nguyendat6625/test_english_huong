document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("quiz-content");
  const scoreBoard = document.getElementById("score-board");
  const scoreSpan = document.getElementById("score");
  const totalSpan = document.getElementById("total");

  let currentScore = 0;
  let quizData = [];

  // Hàm tải dữ liệu từ file JSON
  async function loadQuizData() {
    try {
      const response = await fetch("questions.json");
      if (!response.ok) {
        throw new Error("Không thể tải file câu hỏi.");
      }
      quizData = await response.json();
      totalSpan.textContent = quizData.length;
      renderQuiz();
    } catch (error) {
      container.innerHTML = `<p style="color:red; text-align:center;">
                Lỗi: Không thể tải dữ liệu câu hỏi.<br> 
                Lưu ý: Nếu bạn mở file HTML trực tiếp, trình duyệt có thể chặn file JSON vì lý do bảo mật (CORS).<br>
                Hãy sử dụng <b>Live Server</b> trên VS Code hoặc một Local Server.
                <br><br>Chi tiết lỗi: ${error.message}
            </p>`;
      console.error(error);
    }
  }

  // Hàm hiển thị câu hỏi
  function renderQuiz() {
    let currentSection = "";

    quizData.forEach((item, index) => {
      // Tạo tiêu đề phần (Section) nếu có sự thay đổi
      if (item.section && item.section !== currentSection) {
        currentSection = item.section;
        const sectionTitle = document.createElement("div");
        sectionTitle.className = "section-title";
        sectionTitle.textContent = currentSection;
        container.appendChild(sectionTitle);
      }

      // Tạo khối câu hỏi
      const questionBlock = document.createElement("div");
      questionBlock.className = "question-block";

      // Nội dung câu hỏi
      const qText = document.createElement("div");
      qText.className = "question-text";
      qText.innerHTML = item.q;
      questionBlock.appendChild(qText);

      // Danh sách đáp án
      const ul = document.createElement("ul");
      ul.className = "options";

      // Khu vực hiển thị kết quả/giải thích
      const feedback = document.createElement("div");
      feedback.className = "feedback";

      let answered = false; // Cờ kiểm tra đã trả lời chưa

      item.options.forEach((opt, optIndex) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = opt;

        btn.onclick = () => {
          if (answered) return; // Nếu đã chọn rồi thì không cho chọn lại
          answered = true;
          scoreBoard.style.display = "block";

          // Kiểm tra đúng sai
          if (optIndex === item.answer) {
            btn.classList.add("correct");
            currentScore++;
            feedback.style.backgroundColor = "#d4edda"; // Màu xanh nhạt
            feedback.style.color = "#155724";
            feedback.innerHTML = "✅ <b>Chính xác!</b> " + item.explain;
          } else {
            btn.classList.add("incorrect");
            // Tự động tô xanh đáp án đúng để người dùng biết
            ul.children[item.answer].children[0].classList.add("correct");
            feedback.style.backgroundColor = "#f8d7da"; // Màu đỏ nhạt
            feedback.style.color = "#721c24";
            feedback.innerHTML = "❌ <b>Sai rồi!</b> " + item.explain;
          }

          // Cập nhật điểm số
          scoreSpan.textContent = currentScore;
          feedback.classList.add("show");
        };

        li.appendChild(btn);
        ul.appendChild(li);
      });

      questionBlock.appendChild(ul);
      questionBlock.appendChild(feedback);
      container.appendChild(questionBlock);
    });
  }

  // Bắt đầu chạy
  loadQuizData();
});
