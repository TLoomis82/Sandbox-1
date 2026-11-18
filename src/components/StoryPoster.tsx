/** The Story Maker poster. The art includes the title and the writing credit. */
export function StoryPoster({ className = "" }: { className?: string }) {
  return (
    <div className={`poster ${className}`}>
      <img className="poster__art" src="/side/story-maker-poster.jpg" alt="The Story Maker, written by Tyler Grant Loomis" />
    </div>
  );
}
