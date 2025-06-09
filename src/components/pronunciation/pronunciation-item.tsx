
"use client";

import type { Word } from '@/types';
import type { PronunciationFeedbackOutput } from '@/ai/flows/pronunciation-feedback-flow';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, Square, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; 
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PronunciationItemProps {
  word: Word;
  onAiPracticeToggle: () => void;
  isRecordingAi: boolean;
  isProcessingAi: boolean;
  aiFeedback: PronunciationFeedbackOutput | null;
}

export function PronunciationItem({
  word,
  onAiPracticeToggle,
  isRecordingAi,
  isProcessingAi,
  aiFeedback,
}: PronunciationItemProps) {
  const { toast } = useToast();

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (word.audioUrl) {
      toast({
        title: `Playing: ${word.javanese}`,
        description: `Simulating audio playback. URL: ${word.audioUrl}`,
      });
      // Example: new Audio(word.audioUrl).play().catch(e => console.error("Error playing audio:", e));
    } else {
      toast({
        title: "Audio Not Available",
        description: `No audio pronunciation for "${word.javanese}".`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-start justify-between p-6 gap-4">
      <div className="w-full">
        <div className="flex items-center mb-1">
          <p className="font-headline text-3xl md:text-4xl font-semibold text-primary">{word.javanese}</p>
          {word.audioUrl ? (
             <Button variant="ghost" size="icon" onClick={handlePlayAudio} aria-label={`Play audio for ${word.javanese}`} className="ml-3">
              <Volume2 className="h-6 w-6 text-accent" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" disabled aria-label={`No audio for ${word.javanese}`} className="ml-3">
                <Volume2 className="h-6 w-6 text-muted-foreground" />
            </Button>
          )}
        </div>
        <p className="text-lg text-muted-foreground mb-1">{word.dutch}</p>
        {word.formality && (
          <Badge variant="secondary" className="capitalize mb-3 text-xs">
            Formality: {word.formality}
          </Badge>
        )}
        
        {(word.exampleSentenceJavanese || word.exampleSentenceDutch) && (
          <div className="mt-3 text-sm p-3 bg-muted/50 rounded-md">
            <p className="font-medium text-muted-foreground mb-1">Example:</p>
            {word.exampleSentenceJavanese && <p className="italic text-primary">{word.exampleSentenceJavanese}</p>}
            {word.exampleSentenceDutch && <p className="italic text-muted-foreground mt-0.5">{word.exampleSentenceDutch}</p>}
          </div>
        )}
        
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2 text-primary">AI Pronunciation Tutor</h3>
           <p className="text-xs text-muted-foreground mb-3 italic">
            Note: Microphone recording is currently simulated. This feature will allow real-time feedback in the future.
          </p>
          <Button onClick={onAiPracticeToggle} disabled={isProcessingAi} variant="outline" className="w-full mb-3">
            {isRecordingAi ? (
              <><Square className="mr-2 h-4 w-4 text-red-500" /> Stop & Get Feedback (Simulated)</>
            ) : isProcessingAi ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Feedback...</>
            ) : (
              <><Mic className="mr-2 h-4 w-4" /> Practice with AI Tutor (Simulated)</>
            )}
          </Button>

          {isRecordingAi && (
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Mic className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-700">Recording (Simulated)</AlertTitle>
              <AlertDescription className="text-blue-600">
                The app is simulating microphone recording. Click "Stop & Get Feedback" when ready.
              </AlertDescription>
            </Alert>
          )}

          {isProcessingAi && (
             <div className="text-center py-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                <p className="mt-2 text-muted-foreground">AI is analyzing your pronunciation...</p>
            </div>
          )}

          {aiFeedback && !isProcessingAi && !isRecordingAi && (
            <Card className="bg-card shadow-inner mt-3">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Feedback for: <span className="font-semibold text-primary">{word.javanese}</span></p>
                <div className="my-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">Accuracy Score:</span>
                    <span className={`text-lg font-bold ${aiFeedback.score >= 80 ? 'text-green-600' : aiFeedback.score >= 60 ? 'text-orange-500' : 'text-red-600'}`}>
                      {aiFeedback.score}/100
                    </span>
                  </div>
                  <Progress value={aiFeedback.score} className="h-2 [&>div]:bg-primary" />
                </div>
                <p className="text-sm text-foreground">{aiFeedback.feedbackText}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <p className="text-xs text-muted-foreground italic mt-4">
          More detailed AI-generated explanation and usage examples coming soon!
        </p>
      </div>
    </div>
  );
}
