import Button from "@/app/components/Button/Button";

type NavigationButtonsProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  isComplete: boolean;
};

export default function NavigationButtons({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onComplete,
  isComplete,
}: NavigationButtonsProps) {
  return (
    <div className="nextPrev" style={{ marginTop: 24 }}>
      <Button onClick={onPrev} disabled={currentPage <= 1}>
        Previous
      </Button>
      {currentPage < totalPages ? (
        <Button onClick={onNext}>Next</Button>
      ) : !isComplete ? (
        <Button onClick={onComplete}>Complete</Button>
      ) : null}
    </div>
  );
}
