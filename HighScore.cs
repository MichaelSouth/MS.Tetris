namespace MS.Tetris
{
    public class HighScore
    {
        public HighScore()
        {
        }

        public HighScore(string name, int score)
        {
            Name = name;
            Score = score;
        }

        public string Name { get; set; }
        public int Score { get; set; }

        public override string ToString()
        {
            return $"{Name} Score";
        }
    }
}
