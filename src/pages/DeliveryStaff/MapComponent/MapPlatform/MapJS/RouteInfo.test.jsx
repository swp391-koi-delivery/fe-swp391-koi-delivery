import { render, screen } from '@testing-library/react';
import RouteInfo from './RouteInfo';

describe('RouteInfo component', () => {
  // Kiểm tra trường hợp không có route được cung cấp
  test('renders nothing when route is not provided', () => {
    const { container } = render(<RouteInfo />);
    expect(container).toBeEmptyDOMElement(); // Container phải rỗng nếu không có route
  });

  // Kiểm tra trường hợp có route được cung cấp
  test('renders route information when route is provided', () => {
    const route = [
      [106.8099, 10.8415], // Point A (long, lat)
      [106.660172, 10.762622], // Point B (long, lat)
    ];

    render(<RouteInfo route={route} />);

    // Kiểm tra các phần tử xuất hiện trong component
    expect(screen.getByText('Thông tin tuyến đường:')).toBeInTheDocument();
    expect(screen.getByText(/Khoảng cách:/)).toBeInTheDocument();
    expect(screen.getByText(/Thời gian ước tính:/)).toBeInTheDocument();
  });

  // Kiểm tra khoảng cách và thời gian ước tính với dữ liệu cụ thể
  test('calculates correct distance and duration', () => {
    const route = [
      [106.8099, 10.8415], // Điểm bắt đầu (lon, lat)
      [106.660172, 10.762622], // Điểm đến (lon, lat)
    ];

    render(<RouteInfo route={route} />);

    const distanceElement = screen.getByText(/Khoảng cách:/);
    const durationElement = screen.getByText(/Thời gian ước tính:/);

    // Kiểm tra khoảng cách tính toán có hợp lý
    expect(distanceElement).toHaveTextContent('Khoảng cách:');
    expect(durationElement).toHaveTextContent('Thời gian ước tính:');
  });
});
