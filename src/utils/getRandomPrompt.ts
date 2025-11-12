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
  return randomPrompt + userMessage + 'make the response funny, clear and short.';
};

export default getRandomPrompt;
