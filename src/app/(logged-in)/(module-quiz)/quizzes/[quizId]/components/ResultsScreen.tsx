import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type ResultsScreenProps = {
  show: boolean;
  score: number;
  totalQuestions: number;
};

export default function ResultsScreen({
  show,
  score,
  totalQuestions,
}: ResultsScreenProps) {
  if (!show) return null;

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="successPlayer">
      <DotLottieReact
        src="/assets/images/animations/success.lottie"
        loop={false}
        autoplay
        style={{ width: 300, height: 300 }}
      />
      <div className="quiz-score">
        {score} / {totalQuestions}
      </div>
      <p>You scored {percentage}%!</p>
    </div>
  );
}
