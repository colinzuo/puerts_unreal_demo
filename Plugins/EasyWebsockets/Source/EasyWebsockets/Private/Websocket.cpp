// Copyright 2022 Chris Ringenberg https://www.ringenberg.dev/

#include "Websocket.h"
#include "IWebSocket.h"

void UWebSocket::InitWebSocket(TSharedPtr<IWebSocket> InWebSocket)
{
	UE_LOG(LogTemp, Warning, TEXT("InitWebSocket Enter 333"));

	InternalWebSocket = InWebSocket;

	InternalWebSocket->OnConnected().AddUObject(this, &ThisClass::OnWebSocketConnected_Internal);
	InternalWebSocket->OnConnectionError().AddUObject(this, &ThisClass::OnWebSocketConnectionError_Internal);
	InternalWebSocket->OnClosed().AddUObject(this, &ThisClass::OnWebSocketClosed_Internal);
	InternalWebSocket->OnMessage().AddUObject(this, &ThisClass::OnWebSocketMessageReceived_Internal);
	InternalWebSocket->OnRawMessage().AddUObject(this, &ThisClass::OnWebSocketRawMessageReceived_Internal);
	InternalWebSocket->OnMessageSent().AddUObject(this, &ThisClass::OnWebSocketMessageSent_Internal);
}

void UWebSocket::Connect()
{
	UE_LOG(LogTemp, Warning, TEXT("Connect"));

	InternalWebSocket->Connect();
}

void UWebSocket::Close(int32 StatusCode, const FString& Reason)
{
	InternalWebSocket->Close(StatusCode, Reason);
}

bool UWebSocket::IsConnected() const
{
	return InternalWebSocket->IsConnected();
}

void UWebSocket::SendMessage(const FString& Message)
{
	UE_LOG(LogTemp, Warning, TEXT("SendMessage Len %d"), Message.Len());

	InternalWebSocket->Send(Message);
}

void UWebSocket::SendRawMessage(const FArrayBuffer& Message, bool bIsBinary)
{
	InternalWebSocket->Send(Message.Data, Message.Length, bIsBinary);
}

void UWebSocket::OnWebSocketConnected_Internal()
{
	OnWebSocketConnected.Broadcast();
}

void UWebSocket::OnWebSocketConnectionError_Internal(const FString& Error)
{
	OnWebSocketConnectionError.Broadcast(Error);
}

void UWebSocket::OnWebSocketClosed_Internal(int32 StatusCode, const FString& Reason, bool bWasClean)
{
	UE_LOG(LogTemp, Warning, TEXT("OnWebSocketClosed_Internal StatusCode %d"), StatusCode);

	OnWebSocketClosed.Broadcast(StatusCode, Reason, bWasClean);
}

void UWebSocket::OnWebSocketMessageReceived_Internal(const FString& Message)
{
	UE_LOG(LogTemp, Warning, TEXT("OnWebSocketMessageReceived_Internal Len %d"), Message.Len());

	OnWebSocketMessageReceived.Broadcast(Message);
}

void UWebSocket::OnWebSocketRawMessageReceived_Internal(const void* Data, SIZE_T Size, SIZE_T BytesRemaining)
{
	UE_LOG(LogTemp, Warning, TEXT("OnWebSocketRawMessageReceived_Internal Size %d, BytesRemaining %d"), Size, BytesRemaining);
}

void UWebSocket::OnWebSocketMessageSent_Internal(const FString& Message)
{
	OnWebSocketMessageSent.Broadcast(Message);
}
