// Voxa - Local-First Analytics & Diagnostics (Zero Cloud Telemetry)
// All metrics and events remain strictly on-device.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnalyticsConfig {
    pub api_key: String,
    pub host: Option<String>,
    pub enabled: bool,
}

impl Default for AnalyticsConfig {
    fn default() -> Self {
        Self {
            api_key: String::new(),
            host: None,
            enabled: false,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserSession {
    pub session_id: String,
    pub user_id: String,
    pub start_time: DateTime<Utc>,
    pub is_active: bool,
}

impl UserSession {
    pub fn new(user_id: String) -> Self {
        let now = Utc::now();
        Self {
            session_id: format!("session_{}", Uuid::new_v4()),
            user_id,
            start_time: now,
            is_active: true,
        }
    }

    pub fn duration_seconds(&self) -> i64 {
        (Utc::now() - self.start_time).num_seconds()
    }
}

#[derive(Clone)]
pub struct AnalyticsClient {
    config: AnalyticsConfig,
    user_id: Arc<Mutex<Option<String>>>,
    current_session: Arc<Mutex<Option<UserSession>>>,
}

impl AnalyticsClient {
    pub async fn new(config: AnalyticsConfig) -> Self {
        tracing::debug!("Voxa local diagnostics initialized (cloud telemetry disabled)");
        Self {
            config,
            user_id: Arc::new(Mutex::new(None)),
            current_session: Arc::new(Mutex::new(None)),
        }
    }

    pub fn is_enabled(&self) -> bool {
        self.config.enabled
    }

    pub async fn identify(&self, user_id: String, _properties: Option<HashMap<String, String>>) -> Result<(), String> {
        let mut guard = self.user_id.lock().await;
        *guard = Some(user_id);
        Ok(())
    }

    pub async fn track_event(&self, event_name: &str, properties: Option<HashMap<String, String>>) -> Result<(), String> {
        tracing::debug!("Voxa event: {} (properties: {:?})", event_name, properties);
        Ok(())
    }

    pub async fn start_session(&self, user_id: String) -> Result<String, String> {
        let session = UserSession::new(user_id);
        let session_id = session.session_id.clone();
        let mut guard = self.current_session.lock().await;
        *guard = Some(session);
        Ok(session_id)
    }

    pub async fn end_session(&self) -> Result<(), String> {
        let mut guard = self.current_session.lock().await;
        if let Some(mut session) = guard.take() {
            session.is_active = false;
        }
        Ok(())
    }

    pub async fn track_daily_active_user(&self) -> Result<(), String> {
        self.track_event("daily_active_user", None).await
    }

    pub async fn track_user_first_launch(&self) -> Result<(), String> {
        self.track_event("first_launch", None).await
    }

    pub async fn get_current_session(&self) -> Option<UserSession> {
        self.current_session.lock().await.clone()
    }

    pub async fn is_session_active(&self) -> bool {
        self.current_session.lock().await.as_ref().map_or(false, |s| s.is_active)
    }

    pub async fn track_meeting_started(&self, meeting_id: &str) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("meeting_id".to_string(), meeting_id.to_string());
        self.track_event("meeting_started", Some(props)).await
    }

    pub async fn track_recording_started(&self, meeting_id: &str) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("meeting_id".to_string(), meeting_id.to_string());
        self.track_event("recording_started", Some(props)).await
    }

    pub async fn track_recording_stopped(&self, meeting_id: &str, duration_seconds: Option<u64>) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("meeting_id".to_string(), meeting_id.to_string());
        if let Some(dur) = duration_seconds {
            props.insert("duration_seconds".to_string(), dur.to_string());
        }
        self.track_event("recording_stopped", Some(props)).await
    }

    pub async fn track_meeting_deleted(&self, meeting_id: &str) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("meeting_id".to_string(), meeting_id.to_string());
        self.track_event("meeting_deleted", Some(props)).await
    }

    pub async fn track_settings_changed(&self, setting_type: &str, new_value: &str) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("setting_type".to_string(), setting_type.to_string());
        props.insert("new_value".to_string(), new_value.to_string());
        self.track_event("settings_changed", Some(props)).await
    }

    pub async fn track_app_started(&self, version: &str) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("version".to_string(), version.to_string());
        self.track_event("app_started", Some(props)).await
    }

    pub async fn track_feature_used(&self, feature_name: &str) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("feature_name".to_string(), feature_name.to_string());
        self.track_event("feature_used", Some(props)).await
    }

    pub async fn track_summary_generation_started(&self, model_provider: &str, model_name: &str, transcript_length: usize) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("model_provider".to_string(), model_provider.to_string());
        props.insert("model_name".to_string(), model_name.to_string());
        props.insert("transcript_length".to_string(), transcript_length.to_string());
        self.track_event("summary_generation_started", Some(props)).await
    }

    pub async fn track_summary_generation_completed(&self, model_provider: &str, model_name: &str, success: bool, duration_seconds: Option<u64>, error_message: Option<&str>) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("model_provider".to_string(), model_provider.to_string());
        props.insert("model_name".to_string(), model_name.to_string());
        props.insert("success".to_string(), success.to_string());
        if let Some(d) = duration_seconds {
            props.insert("duration_seconds".to_string(), d.to_string());
        }
        if let Some(err) = error_message {
            props.insert("error_message".to_string(), err.to_string());
        }
        self.track_event("summary_generation_completed", Some(props)).await
    }

    pub async fn track_summary_regenerated(&self, model_provider: &str, model_name: &str) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("model_provider".to_string(), model_provider.to_string());
        props.insert("model_name".to_string(), model_name.to_string());
        self.track_event("summary_regenerated", Some(props)).await
    }

    pub async fn track_model_changed(&self, old_provider: &str, old_model: &str, new_provider: &str, new_model: &str) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("old_provider".to_string(), old_provider.to_string());
        props.insert("old_model".to_string(), old_model.to_string());
        props.insert("new_provider".to_string(), new_provider.to_string());
        props.insert("new_model".to_string(), new_model.to_string());
        self.track_event("model_changed", Some(props)).await
    }

    pub async fn track_custom_prompt_used(&self, prompt_length: usize) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("prompt_length".to_string(), prompt_length.to_string());
        self.track_event("custom_prompt_used", Some(props)).await
    }

    pub async fn track_meeting_ended(
        &self,
        transcription_provider: &str,
        transcription_model: &str,
        summary_provider: &str,
        summary_model: &str,
        total_duration_seconds: Option<f64>,
        active_duration_seconds: f64,
        pause_duration_seconds: f64,
        microphone_device_type: &str,
        system_audio_device_type: &str,
        chunks_processed: u64,
        transcript_segments_count: u64,
        had_fatal_error: bool,
    ) -> Result<(), String> {
        let mut props = HashMap::new();
        props.insert("transcription_provider".to_string(), transcription_provider.to_string());
        props.insert("transcription_model".to_string(), transcription_model.to_string());
        props.insert("summary_provider".to_string(), summary_provider.to_string());
        props.insert("summary_model".to_string(), summary_model.to_string());
        if let Some(t) = total_duration_seconds {
            props.insert("total_duration_seconds".to_string(), t.to_string());
        }
        props.insert("active_duration_seconds".to_string(), active_duration_seconds.to_string());
        props.insert("pause_duration_seconds".to_string(), pause_duration_seconds.to_string());
        props.insert("microphone_device_type".to_string(), microphone_device_type.to_string());
        props.insert("system_audio_device_type".to_string(), system_audio_device_type.to_string());
        props.insert("chunks_processed".to_string(), chunks_processed.to_string());
        props.insert("transcript_segments_count".to_string(), transcript_segments_count.to_string());
        props.insert("had_fatal_error".to_string(), had_fatal_error.to_string());
        self.track_event("meeting_ended", Some(props)).await
    }

    pub async fn track_analytics_enabled(&self) -> Result<(), String> {
        self.track_event("diagnostics_enabled", None).await
    }

    pub async fn track_analytics_disabled(&self) -> Result<(), String> {
        self.track_event("diagnostics_disabled", None).await
    }

    pub async fn track_analytics_transparency_viewed(&self) -> Result<(), String> {
        self.track_event("privacy_transparency_viewed", None).await
    }

    pub async fn set_user_properties(&self, properties: HashMap<String, String>) -> Result<(), String> {
        self.track_event("user_properties_set", Some(properties)).await
    }
}

pub async fn create_analytics_client(config: AnalyticsConfig) -> AnalyticsClient {
    AnalyticsClient::new(config).await
}
