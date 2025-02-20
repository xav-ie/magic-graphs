/**
 * definitions for markov chain terms
 */
export default {
  valid:
    'A markov chain is valid if all states have an outgoing probability of 1.',
  periodic:
    'A markov chain is said to be periodic if the greatest common divisor of the lengths of all possible cycles is greater than one.',
  absorbing:
    'an absorbing markov chain is a chain with at least one absorbing state, which is a state that once entered cannot be left.',
  communicatingClasses:
    'A communicating class is a subset of states in a Markov chain such that any state in the subset can be reached from any other state in the subset.',
  steadyState:
    'A steady state is a state in which the system is in equilibrium and the properties of the system do not change over time.',
} as const;
