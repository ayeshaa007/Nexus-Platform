import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const FundingDealFlow = ({ steps = [], dealName, totalAmount }) => {
  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Funding Deal Flow</h2>
            {dealName && (
              <p className="text-sm text-gray-500 mt-0.5">{dealName}</p>
            )}
          </div>
          {totalAmount && (
            <Badge variant="primary">{totalAmount}</Badge>
          )}
        </div>
      </CardHeader>
      <CardBody className="space-y-5">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{completedSteps} of {steps.length} steps completed</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, i) => {
            const isCompleted = step.completed;
            const isCurrent = !isCompleted && (i === 0 || steps[i - 1].completed);
            return (
              <div
                key={step.step}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${isCompleted
                    ? 'border-green-200 bg-green-50'
                    : isCurrent
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <Circle size={20} className="text-gray-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium
                      ${isCompleted ? 'text-green-800' : isCurrent ? 'text-primary-800' : 'text-gray-400'}
                    `}
                  >
                    {step.label}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {isCompleted && (
                    <Badge variant="success" size="sm">Done</Badge>
                  )}
                  {isCurrent && (
                    <Badge variant="primary" size="sm">In Progress</Badge>
                  )}
                  {!isCompleted && !isCurrent && (
                    <Badge variant="gray" size="sm">Pending</Badge>
                  )}
                </div>

                {i < steps.length - 1 && (
                  <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {progress === 100 && (
          <div className="text-center py-3 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle size={24} className="mx-auto text-green-600 mb-1" />
            <p className="text-sm font-semibold text-green-800">Deal Complete!</p>
            <p className="text-xs text-green-600">Funds have been successfully released.</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
