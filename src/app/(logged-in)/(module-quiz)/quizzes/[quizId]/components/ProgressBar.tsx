type ProgressBarProps = {
  currentPage: number;
  totalPages: number;
};

export default function ProgressBar({
  currentPage,
  totalPages,
}: ProgressBarProps) {
  const progress = Math.min(100, Math.max(0, (currentPage / totalPages) * 100));

  return (
    <div className="progress-container">
      <p>
        Question {currentPage} of {totalPages}
      </p>
      <div
        style={{
          width: "50%",
          backgroundColor: "#eee",
          borderRadius: 8,
          height: 25,
          marginBottom: 20,
          boxShadow: "2px 2px 0 rgb(71, 71, 71)",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: "rgb(153, 85, 235)",
            height: "100%",
            borderRadius: 8,
            transition: "width 0.3s",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ color: "white", paddingLeft: 10, lineHeight: "25px" }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
