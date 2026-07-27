/* Jest setup — global mocks shared across the test suites. */

// @testing-library/react-native v13 registers its matchers automatically.

// Silence the reanimated animation runtime in tests.
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// moti renders plain Views/Fragments in tests — avoids the animation runtime.
jest.mock("moti", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    MotiView: (props) => React.createElement(View, props, props.children),
    MotiText: (props) => React.createElement(Text, props, props.children),
    View: (props) => React.createElement(View, props, props.children),
    AnimatePresence: (props) => React.createElement(React.Fragment, null, props.children),
    useAnimationState: () => ({ transitionTo: jest.fn() }),
  };
});

// lucide icons → simple stubs (SVGs we don't assert on).
jest.mock("lucide-react-native", () => {
  const React = require("react");
  const { View } = require("react-native");
  return new Proxy(
    {},
    {
      get: () => (props) => React.createElement(View, props),
    }
  );
});

// Router — assert navigation without a real navigator.
jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
  useRouter: () => ({ replace: jest.fn(), push: jest.fn(), back: jest.fn() }),
}));
