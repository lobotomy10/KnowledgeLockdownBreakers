import React, { useState, useEffect, useRef } from 'react';
import './RealtimeAudioProcessor.css';

interface AudioSegmentResult {
  segment_id: string;
  start_time: number;
  end_time: number;
  transcript: string;
  keywords: string[];
}

const RealtimeAudioProcessor: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcripts, setTranscripts] = useState<AudioSegmentResult[]>([]);
  const [currentKeywords, setCurrentKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/audio');
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'transcript') {
          const newSegment: AudioSegmentResult = {
            segment_id: data.segment_id,
            start_time: data.start_time,
            end_time: data.end_time,
            transcript: data.transcript,
            keywords: data.keywords
          };
          
          setTranscripts(prev => [...prev, newSegment]);
          setCurrentKeywords(data.keywords);
          
          if (data.keywords && data.keywords.length > 0) {
            setInputValue(data.keywords.join(', '));
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setErrorMessage('WebSocketに接続できませんでした。サーバーが実行中か確認してください。');
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    socketRef.current = socket;
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        sendAudioToServer(audioBlob);
        audioChunksRef.current = [];
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setElapsedTime(0);
      
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          
          if (newTime % 30 === 0 && mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            
            setTimeout(() => {
              if (isRecording && mediaRecorderRef.current) {
                mediaRecorderRef.current.start();
              }
            }, 100);
          }
          
          return newTime;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorMessage('マイクへのアクセスが拒否されました。ブラウザの設定でマイクへのアクセスを許可してください。');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
  };
  
  const sendAudioToServer = (audioBlob: Blob) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(audioBlob);
    } else {
      console.error('WebSocket is not connected');
      setErrorMessage('WebSocketが接続されていません。再接続してください。');
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="realtime-audio-processor">
      <h1>リアルタイム音声処理システム</h1>
      
      <div className="control-panel">
        <div className="recording-status">
          {isRecording ? (
            <div className="recording-indicator">
              <span className="recording-dot"></span>
              <span>録音中 - {formatTime(elapsedTime)}</span>
            </div>
          ) : (
            <span>録音停止中</span>
          )}
        </div>
        
        <div className="control-buttons">
          {!isRecording ? (
            <button className="start-button" onClick={startRecording}>
              録音開始
            </button>
          ) : (
            <button className="stop-button" onClick={stopRecording}>
              録音停止
            </button>
          )}
        </div>
      </div>
      
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>閉じる</button>
        </div>
      )}
      
      <div className="results-container">
        <div className="transcripts-container">
          <h2>文字起こし結果</h2>
          <div className="transcripts-list">
            {transcripts.length > 0 ? (
              transcripts.map((segment, index) => (
                <div key={segment.segment_id} className="transcript-item">
                  <div className="transcript-header">
                    <span className="segment-time">
                      {formatTime(segment.start_time)} - {formatTime(segment.end_time)}
                    </span>
                  </div>
                  <p className="transcript-text">{segment.transcript}</p>
                  <div className="keywords-list">
                    {segment.keywords.map((keyword, kidx) => (
                      <span key={`${segment.segment_id}-kw-${kidx}`} className="keyword-tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data-message">録音を開始すると、ここに文字起こし結果が表示されます。</p>
            )}
          </div>
        </div>
        
        <div className="keywords-container">
          <h2>抽出されたキーワード</h2>
          <div className="current-keywords">
            {currentKeywords.length > 0 ? (
              currentKeywords.map((keyword, index) => (
                <span key={`current-kw-${index}`} className="keyword-tag">
                  {keyword}
                </span>
              ))
            ) : (
              <p className="no-data-message">録音を開始すると、ここにキーワードが表示されます。</p>
            )}
          </div>
          
          <div className="keyword-input">
            <h3>キーワード入力</h3>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="抽出されたキーワードがここに表示されます"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeAudioProcessor;
