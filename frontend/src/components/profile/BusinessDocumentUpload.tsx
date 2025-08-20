'use client';

import { useState, useRef } from 'react';
import { Vendor } from '@/types';
import { useVendorDocuments } from '@/hooks/useVendor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Download,
  Camera,
  Shield,
  Image as ImageIcon
} from 'lucide-react';

interface BusinessDocumentUploadProps {
  vendor?: Vendor;
  onUpdate?: (updatedVendor: Partial<Vendor>) => void;
  disabled?: boolean;
}

interface UploadState {
  type: 'business_license' | 'tax_id' | 'portfolio';
  file?: File;
  files?: File[];
  uploading: boolean;
  progress: number;
  url?: string;
  urls?: string[];
  error?: string;
}

export function BusinessDocumentUpload({ vendor, onUpdate, disabled = false }: BusinessDocumentUploadProps) {
  const { uploadBusinessLicense, uploadTaxIdFile, uploadPortfolioImages, submitForVerification, loading, error } = useVendorDocuments();
  
  const [uploads, setUploads] = useState<{
    businessLicense: UploadState;
    taxId: UploadState;
    portfolio: UploadState;
  }>({
    businessLicense: { type: 'business_license', uploading: false, progress: 0, url: vendor?.businessLicense },
    taxId: { type: 'tax_id', uploading: false, progress: 0, url: vendor?.taxIdFile },
    portfolio: { type: 'portfolio', uploading: false, progress: 0, urls: vendor?.portfolioImages || [] }
  });

  const businessLicenseRef = useRef<HTMLInputElement>(null);
  const taxIdRef = useRef<HTMLInputElement>(null);
  const portfolioRef = useRef<HTMLInputElement>(null);

  const [verificationSubmitting, setVerificationSubmitting] = useState(false);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  const updateUploadState = (type: keyof typeof uploads, update: Partial<UploadState>) => {
    setUploads(prev => ({
      ...prev,
      [type]: { ...prev[type], ...update }
    }));
  };

  const handleFileSelect = (type: keyof typeof uploads, files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;

    if (type === 'portfolio') {
      const fileArray = Array.from(files);
      if (fileArray.length > 10) {
        updateUploadState(type, { error: 'Maximum 10 images allowed' });
        return;
      }
      updateUploadState(type, { files: fileArray, error: undefined });
    } else {
      const file = files[0];
      updateUploadState(type, { file, error: undefined });
    }
  };

  const validateFile = (file: File, type: keyof typeof uploads): string | null => {
    const maxSizes = {
      businessLicense: 10 * 1024 * 1024, // 10MB
      taxId: 10 * 1024 * 1024, // 10MB
      portfolio: 5 * 1024 * 1024 // 5MB per image
    };

    const allowedTypes = {
      businessLicense: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      taxId: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      portfolio: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    };

    if (file.size > maxSizes[type]) {
      return `File too large. Maximum size is ${maxSizes[type] / (1024 * 1024)}MB`;
    }

    if (!allowedTypes[type].includes(file.mimetype)) {
      return `Invalid file type. Allowed: ${allowedTypes[type].map(t => t.split('/')[1]).join(', ')}`;
    }

    return null;
  };

  const simulateProgress = (type: keyof typeof uploads) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 95) {
        clearInterval(interval);
        progress = 95;
      }
      updateUploadState(type, { progress });
    }, 200);
    return interval;
  };

  const handleUpload = async (type: keyof typeof uploads) => {
    const uploadState = uploads[type];
    
    if (type === 'portfolio') {
      if (!uploadState.files || uploadState.files.length === 0) return;
      
      // Validate all files
      for (const file of uploadState.files) {
        const error = validateFile(file, type);
        if (error) {
          updateUploadState(type, { error });
          return;
        }
      }

      updateUploadState(type, { uploading: true, progress: 0, error: undefined });
      const progressInterval = simulateProgress(type);

      try {
        const urls = await uploadPortfolioImages(uploadState.files);
        clearInterval(progressInterval);
        updateUploadState(type, { 
          uploading: false, 
          progress: 100, 
          urls, 
          files: undefined 
        });
        onUpdate?.({ portfolioImages: urls });
      } catch (err) {
        clearInterval(progressInterval);
        updateUploadState(type, { 
          uploading: false, 
          progress: 0, 
          error: err instanceof Error ? err.message : 'Upload failed' 
        });
      }
    } else {
      if (!uploadState.file) return;

      const error = validateFile(uploadState.file, type);
      if (error) {
        updateUploadState(type, { error });
        return;
      }

      updateUploadState(type, { uploading: true, progress: 0, error: undefined });
      const progressInterval = simulateProgress(type);

      try {
        let url: string;
        if (type === 'businessLicense') {
          url = await uploadBusinessLicense(uploadState.file);
          onUpdate?.({ businessLicense: url });
        } else {
          url = await uploadTaxIdFile(uploadState.file);
          onUpdate?.({ taxIdFile: url });
        }

        clearInterval(progressInterval);
        updateUploadState(type, { 
          uploading: false, 
          progress: 100, 
          url, 
          file: undefined 
        });
      } catch (err) {
        clearInterval(progressInterval);
        updateUploadState(type, { 
          uploading: false, 
          progress: 0, 
          error: err instanceof Error ? err.message : 'Upload failed' 
        });
      }
    }
  };

  const handleRemoveFile = (type: keyof typeof uploads, index?: number) => {
    if (disabled) return;

    if (type === 'portfolio' && typeof index === 'number') {
      const currentUrls = uploads.portfolio.urls || [];
      const newUrls = currentUrls.filter((_, i) => i !== index);
      updateUploadState(type, { urls: newUrls });
      onUpdate?.({ portfolioImages: newUrls });
    } else {
      updateUploadState(type, { file: undefined, url: undefined, error: undefined });
    }
  };

  const handleSubmitVerification = async () => {
    try {
      setVerificationSubmitting(true);
      await submitForVerification();
      setVerificationSubmitted(true);
      onUpdate?.({ verificationStatus: 'PENDING' });
    } catch (err) {
      console.error('Failed to submit for verification:', err);
    } finally {
      setVerificationSubmitting(false);
    }
  };

  const canSubmitForVerification = () => {
    return uploads.businessLicense.url && !verificationSubmitted;
  };

  const renderFileUploadCard = (
    type: keyof typeof uploads,
    title: string,
    description: string,
    icon: React.ReactNode,
    required = false
  ) => {
    const uploadState = uploads[type];
    const inputRef = type === 'businessLicense' ? businessLicenseRef : 
                     type === 'taxId' ? taxIdRef : portfolioRef;

    return (
      <Card key={type}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
            {required && <Badge variant="destructive" className="text-xs">Required</Badge>}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <input
            ref={inputRef}
            type="file"
            accept={type === 'portfolio' ? 'image/*' : '.pdf,.jpg,.jpeg,.png'}
            multiple={type === 'portfolio'}
            onChange={(e) => handleFileSelect(type, e.target.files)}
            className="hidden"
            disabled={disabled || uploadState.uploading}
          />

          {/* Upload Button/Area */}
          {!uploadState.url && (!uploadState.urls || uploadState.urls.length === 0) && (
            <div
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload {type === 'portfolio' ? 'images' : 'file'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {type === 'portfolio' 
                  ? 'JPG, PNG, WebP up to 5MB each (max 10 images)'
                  : 'PDF, JPG, PNG up to 10MB'
                }
              </p>
            </div>
          )}

          {/* Selected File Preview */}
          {uploadState.file && !uploadState.url && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">{uploadState.file.name}</p>
                <p className="text-xs text-gray-500">
                  {(uploadState.file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(type)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Selected Portfolio Files Preview */}
          {uploadState.files && uploadState.files.length > 0 && (
            <div className="space-y-2">
              {uploadState.files.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  {!disabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newFiles = uploadState.files?.filter((_, i) => i !== index);
                        updateUploadState(type, { files: newFiles });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {uploadState.uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadState.progress)}%</span>
              </div>
              <Progress value={uploadState.progress} className="w-full" />
            </div>
          )}

          {/* Upload Button */}
          {((uploadState.file && !uploadState.url) || (uploadState.files && uploadState.files.length > 0 && (!uploadState.urls || uploadState.urls.length === 0))) && !uploadState.uploading && (
            <Button
              onClick={() => handleUpload(type)}
              disabled={disabled}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload {type === 'portfolio' ? 'Images' : 'File'}
            </Button>
          )}

          {/* Uploaded File Success */}
          {uploadState.url && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">File uploaded successfully</p>
                <a 
                  href={uploadState.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View file
                </a>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                Replace
              </Button>
            </div>
          )}

          {/* Uploaded Portfolio Images */}
          {uploadState.urls && uploadState.urls.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">
                  {uploadState.urls.length} image(s) uploaded
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {uploadState.urls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    {!disabled && (
                      <button
                        onClick={() => handleRemoveFile(type, index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                className="w-full"
              >
                Add More Images
              </Button>
            </div>
          )}

          {/* Error Message */}
          {uploadState.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadState.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Business Documents
          </CardTitle>
          <CardDescription>
            Upload required business documents for verification and trust building.
            These documents help establish credibility with potential clients.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Document Upload Cards */}
      <div className="grid gap-6">
        {renderFileUploadCard(
          'businessLicense',
          'Business License',
          'Upload your business license or registration certificate. This is required for verification.',
          <FileText className="h-5 w-5" />,
          true
        )}

        {renderFileUploadCard(
          'taxId',
          'Tax ID (NPWP)',
          'Upload your tax identification document (NPWP). This helps with payment processing.',
          <FileText className="h-5 w-5" />
        )}

        {renderFileUploadCard(
          'portfolio',
          'Portfolio Images',
          'Upload images showcasing your previous work. This helps clients understand your service quality.',
          <Camera className="h-5 w-5" />
        )}
      </div>

      {/* Verification Submission */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="h-5 w-5" />
            Verification Status
          </CardTitle>
          <CardDescription className="text-blue-700">
            {vendor?.verificationStatus === 'VERIFIED' && 'Your account is verified and trusted by IndoVendor.'}
            {vendor?.verificationStatus === 'PENDING' && 'Your verification is under review. We will notify you once it is complete.'}
            {vendor?.verificationStatus === 'REJECTED' && 'Your verification was rejected. Please check your documents and try again.'}
            {(!vendor?.verificationStatus || vendor?.verificationStatus === 'PENDING') && 
             'Submit your business license to start the verification process.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vendor?.verificationStatus === 'VERIFIED' && (
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Account Verified</span>
            </div>
          )}

          {vendor?.verificationStatus === 'PENDING' && (
            <div className="flex items-center gap-2 text-blue-800">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="font-medium">Verification Under Review</span>
            </div>
          )}

          {(!vendor?.verificationStatus || vendor?.verificationStatus === 'REJECTED') && canSubmitForVerification() && (
            <Button
              onClick={handleSubmitVerification}
              disabled={verificationSubmitting || disabled}
              className="w-full"
            >
              {verificationSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Verification
            </Button>
          )}

          {verificationSubmitted && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Verification request submitted successfully! We'll review your documents and notify you within 3-5 business days.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">📋 Document Guidelines:</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Ensure all documents are clear and readable</li>
              <li>• Business license should be current and valid</li>
              <li>• Portfolio images should showcase your best work</li>
              <li>• All documents are securely stored and only used for verification</li>
              <li>• Verification typically takes 3-5 business days</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}