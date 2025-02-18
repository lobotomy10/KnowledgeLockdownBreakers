import { render, fireEvent } from '@testing-library/react';
import { FileInput } from '../../../components/ui/file-input';

describe('FileInput component', () => {
  it('should handle 200MB image upload', async () => {
    // Create a 200MB test file
    const content = new Array(200 * 1024 * 1024).fill('a').join('');
    const file = new File([content], 'test_200mb.jpg', { type: 'image/jpeg' });
    
    // Mock file input change event
    const onFileSelect = jest.fn();
    const { getByTestId } = render(<FileInput onFileSelect={onFileSelect} />);
    
    // Trigger file input change
    const input = getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });
    
    // Verify file was accepted
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });
});
