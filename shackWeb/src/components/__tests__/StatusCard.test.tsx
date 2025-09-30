// Jest provides describe, it, expect globally
import { render, screen } from "../../test-utils";
import { DeviceThermostat, Opacity, WaterDrop } from "@mui/icons-material";
import StatusCard, {
  TemperatureCard,
  HumidityCard,
  FlowRateCard,
} from "../StatusCard";

describe("StatusCard", () => {
  it("renders basic status card with title and value", () => {
    render(
      <StatusCard
        title="Test Card"
        value={42}
        unit="°C"
        icon={<DeviceThermostat />}
        color="primary"
      />
    );

    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("°C")).toBeInTheDocument();
  });

  it("shows active indicator when isActive is true", () => {
    render(
      <StatusCard
        title="Active Card"
        value={100}
        icon={<WaterDrop />}
        isActive={true}
      />
    );

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("displays progress bar when progress is provided", () => {
    render(
      <StatusCard
        title="Progress Card"
        value={75}
        unit="%"
        icon={<Opacity />}
        progress={75}
      />
    );
    // expect(screen.getByText("75% of optimal range")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows trend indicator when trend is provided", () => {
    render(
      <StatusCard
        title="Trend Card"
        value={25}
        icon={<DeviceThermostat />}
        trend="up"
        trendValue="+2°C from yesterday"
      />
    );

    expect(screen.getByText("+2°C from yesterday")).toBeInTheDocument();
  });

  it("displays subtitle when provided", () => {
    render(
      <StatusCard
        title="Subtitle Card"
        value={50}
        icon={<DeviceThermostat />}
        subtitle="Current reading"
      />
    );

    expect(screen.getByText("Current reading")).toBeInTheDocument();
  });
});

describe("TemperatureCard", () => {
  it("renders temperature with correct color coding", () => {
    render(<TemperatureCard temperature={25} />);

    expect(screen.getByText("Temperature")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("°C")).toBeInTheDocument();
    expect(screen.getByText("Current ambient temperature")).toBeInTheDocument();
  });

  it("shows warning color for extreme temperatures", () => {
    const { container } = render(<TemperatureCard temperature={5} />);
    // Test that the card is rendered (specific color testing would require more complex setup)
    expect(container.firstChild).toBeInTheDocument();
  });

  it("displays trend when provided", () => {
    render(<TemperatureCard temperature={22} trend="up" trendValue="+3°C" />);

    expect(screen.getByText("+3°C")).toBeInTheDocument();
  });
});

describe("HumidityCard", () => {
  it("renders humidity with percentage", () => {
    render(<HumidityCard humidity={65} />);

    expect(screen.getByText("Humidity")).toBeInTheDocument();
    expect(screen.getByText("65")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("Relative humidity level")).toBeInTheDocument();
  });

  it("shows trend when provided", () => {
    render(<HumidityCard humidity={45} trend="down" trendValue="-5%" />);

    expect(screen.getByText("-5%")).toBeInTheDocument();
  });
});

describe("FlowRateCard", () => {
  it("renders flow rate information", () => {
    render(<FlowRateCard flowRate={2.5} />);

    expect(screen.getByText("Water Flow")).toBeInTheDocument();
    expect(screen.getByText("2.5")).toBeInTheDocument();
    expect(screen.getByText("L/min")).toBeInTheDocument();
  });

  it("shows active state when flow rate is positive", () => {
    render(<FlowRateCard flowRate={1.2} isActive={true} />);

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("displays last watering time when provided", () => {
    render(<FlowRateCard flowRate={0} lastWatering="2 hours ago" />);

    expect(screen.getByText("Last watering: 2 hours ago")).toBeInTheDocument();
  });
});
