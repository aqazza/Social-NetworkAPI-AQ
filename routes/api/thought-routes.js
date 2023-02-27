const router = require("express").Router();
const { Thought, Reaction } = require("../../models");

//TODO: ROUTE TO GET ALL THOUGHTS
router.get("/", (req, res) => {
  Thought.find({}, (err, thoughts) => {
    res.status(200).json(thoughts);
  });
});

//TODO: ROUTE TO CREATE A NEW THOUGHT
router.post("/", (req, res) => {
  Thought.create(
    {
      thoughtText: req.body.thoughtText,
      username: req.body.username,
    },
    (err, thought) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(true);
      }
    }
  );
});

//TODO: ROUTE TO GET SINGLE THOUGHT BASED ON THOUGHT ID
router.get("/:thoughtId", (req, res) => {
  Thought.findById(req.params.thoughtId, (err, thought) => {
    if (err) {
      res.status(500).json(err);
    } else if (!thought) {
      res.status(404).json({ message: "No thought found with this id!" });
    } else {
      res.status(200).json(thought);
    }
  });
});
//TODO: ROUTE TO UPDATE A THOUGHT
router.put("/:thoughtId", (req, res) => {
  Thought.findByIdAndUpdate({ _id: req.params.thoughtId }, req.body, {
    new: true,
  })
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//TODO: ROUTE TO DELETE A THOUGHT BASED ON THOUGHT ID
router.delete("/:thoughtId", (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//TODO: ROUTE TO ADD REACTION TO A THOUGHT

router.post("/:thoughtId/reactions", (req, res) => {
  Reaction.create(req.body)
    .then(({ _id }) => {
      return Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true }
      );
    })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch((err) => res.json(err));
});
//TODO: ROUTE TO DELETE A REACTION ON A THOUGHT
router.delete("/:thoughtId/reactions/:reactionId", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { new: true }
  )
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
