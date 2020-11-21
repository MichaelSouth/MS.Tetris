using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Text.Json;

namespace MS.Tetris.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HighScoreController : ControllerBase
    {
        private const string HIGHSCORESFILENAME = "HighScoresRepository.txt";
        private readonly ILogger<HighScoreController> _logger;

        public HighScoreController(ILogger<HighScoreController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<HighScore>> Get()
        {
           return GetHighScores();
        }

        [HttpPost]
        public ActionResult Post(HighScore highScore)
        {
            _logger.LogInformation($"Save highscore: {highScore}");
            var highScores = GetHighScores();

            //Add high score
            int i;
            for (i=0; i<highScores.Count; i++)
            {
                if (highScores[i].Score < highScore.Score)
                {
                    break;
                }
            }

            highScores.Insert(i, highScore);

            SaveHighScores(highScores);

            return Ok();
        }

        private List<HighScore> GetHighScores()
        {
            if (!System.IO.File.Exists(HIGHSCORESFILENAME))
            {
                var newHighScores = new List<HighScore>();

                for(var i =0;i<10;i++)
                {
                    newHighScores.Insert(0, new HighScore("Southy", (i+1)));
                }
            
                SaveHighScores(newHighScores);
            }

            var jsonString = System.IO.File.ReadAllText(HIGHSCORESFILENAME);
            var highScores = JsonSerializer.Deserialize<List<HighScore>>(jsonString);

            return highScores;
        }

        private void SaveHighScores(IEnumerable<HighScore> highScores)
        {
            var jsonString = JsonSerializer.Serialize(highScores);
            System.IO.File.WriteAllText(HIGHSCORESFILENAME, jsonString);
        }
    }
}
