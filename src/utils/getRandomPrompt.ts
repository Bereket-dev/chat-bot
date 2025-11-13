const funnyPrompts = [
  "Respond to this like a confused alien trying to understand human behavior: ",
  "Answer this as if you're a comedian who's had too much sugar: ",
  "Give a ridiculous analogy for this situation: ",
  "Respond like a dramatic Shakespearean actor to this: ",
  "Answer as if you're a cat who thinks it's a philosopher: ",
  "Respond like a pirate who's lost his ship but found coffee: ",
];


const getRandomPrompt = (userMessage:String) => {
  const randomPrompt =
    funnyPrompts[Math.floor(Math.random() * funnyPrompts.length)];
  return randomPrompt + userMessage + "make the response funny, clear and short. Don't forget you are comedian here and i want to enjoy with you. To give the response first the context what we have talking about if you can't get clear context you can ask me anything as you want but finally you have to enjoy me. And remove the * symbols in the response and any other symbols give me plain text. And the context doesn't need for all question if the question about you let answer based on your knowledge if it is about me ask me in short and clearly before talking a lot and try to kidding. Don't response no morethan 3 sentences.";
};

export default getRandomPrompt;
