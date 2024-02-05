interface State {
    currentValue: string,
    operator: any,
    previousValue: any    
}

export const initialState:State = {
    currentValue: "0",
    operator: null,
    previousValue: null
}

export const handleNumber = (value: any, state:State): any =>{
  if (state.currentValue === "0" && !state.previousValue) {
    return { ...initialState, currentValue: `${value}` };
  }

  return {
    ...state,
    currentValue: `${state.currentValue}${value}`,
  };
};

const handleEqual = (state:any) => {
  const { currentValue, previousValue, operator } = state;

  const current = parseFloat(currentValue);
  const previous = parseFloat(previousValue);
  const resetState = { operator: null, previousValue: null };

  switch (operator) {
    case "+":
      return {
        currentValue: `${previous + current}`,
        ...resetState,
      };
    case "-":
      return {
        currentValue: `${previous - current}`,
        ...resetState,
      };
    case "*":
      return {
        currentValue: `${previous * current}`,
        ...resetState,
      };
    case "/":
      return {
        currentValue: `${previous / current}`,
        ...resetState,
      };

    default:
      return state;
  }
};

// calculator function
const calculator = (type: string, value: any, state:any) => {
  switch (type) {
    case "number":
      return handleNumber(value, state);
    case "clear":
      return initialState;
    case "posneg":
      return {
        ...state,
        currentValue: `${parseFloat(state.currentValue) * -1}`,
      };
    case "percentage":
      return {
        ...state,
        currentValue: `${parseFloat(state.currentValue) * 0.01}`,
      };
    case "operator":
      return {
        ...state,
        operator: value,
        previousValue: state.currentValue,
        currentValue: "0",
      };
    case "equal":
      return handleEqual(state);
    default:
      return state;
  }
};

export default calculator;