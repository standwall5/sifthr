type NavigationButtonsProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isComplete: boolean;
};

export default function NavigationButtons({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onSubmit,
  isComplete,
}: NavigationButtonsProps) {
  return (
    <div className="nextPrev" style={{ marginTop: 24 }}>
      <button
        className="sifthr-button"
        onClick={onPrev}
        disabled={currentPage <= 1}
      >
        Previous
      </button>
      {currentPage < totalPages ? (
        <button className="sifthr-button" onClick={onNext}>
          Next
        </button>
      ) : !isComplete ? (
        <button className="sifthr-button" onClick={onSubmit}>
          Submit Quiz
        </button>
      ) : null}
    </div>
  );
}
