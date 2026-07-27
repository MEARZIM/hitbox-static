import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import {
    AlertTriangle,
    Award,
    BadgeCheck,
    CheckCircle2,
    Info,
    RefreshCw,
    ScanLine,
    ShieldAlert,
    ShieldCheck,
} from 'lucide-react-native';
import { View as MotiView } from 'moti';
import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NfcRequestError } from '../api/client';
import { useConfirmClaim } from '../api/useConfirmClaim';
import { useLedger } from '../api/useLedger';
import { useValidateTag } from '../api/useValidateTag';
import { ClaimResult, LedgerEntry, ValidateResult } from '../types/claim';

/** Pulls the backend error code out of a thrown NfcRequestError. */
function errorCodeOf(err: unknown): string | null {
    return err instanceof NfcRequestError ? err.error.code : null;
}

/**
 * Tap → verify against the ledger → claim. No sign-in required for now: the
 * NFC api client sends a fixed account, so claims still record a real userId
 * and "you already own this" works.
 */
export default function ClaimScreen({ tagId }: { tagId: string }) {
    const validate = useValidateTag(tagId);
    const ledger = useLedger(tagId, validate.isSuccess);
    const confirm = useConfirmClaim(tagId);

    // Re-check whenever the screen regains focus.
    useFocusEffect(
        useCallback(() => {
            void validate.refetch();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [tagId]),
    );

    const code = errorCodeOf(validate.error);
    const notRegistered = code === 'CLAIMS_TAG_NOT_FOUND';

    const claimed = confirm.data?.outcome === 'CLAIMED' ? confirm.data : null;
    const v = validate.data;

    const busy = validate.isPending || confirm.isPending;
    const busyLabel = confirm.isPending ? 'Claiming your item…' : 'Verifying on the ledger…';

    return (
        <SafeAreaView className="flex-1 bg-[#050507]">
            <StatusBar barStyle="light-content" />
            <ScrollView className="px-5 pt-3" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="items-center my-2">
                    <Text className="text-white text-3xl font-black tracking-widest uppercase">
                        HIT<Text className="text-primary">B★X</Text>
                    </Text>
                </MotiView>

                {/* The scanned tag */}
                <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0F0F13] border border-[#1F1F24] rounded-xl p-3.5 mt-2 mb-5 flex-row items-center">
                    <ScanLine color="#208AEF" size={22} />
                    <View className="ml-3">
                        <Text className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">NFC Tag</Text>
                        <Text className="text-white text-base font-bold tracking-wide">{tagId}</Text>
                    </View>
                </MotiView>

                {busy && (
                    <View className="items-center mt-16">
                        <ActivityIndicator size="large" color="#208AEF" />
                        <Text className="text-neutral-300 mt-4 text-base font-medium">{busyLabel}</Text>
                    </View>
                )}

                {!busy && notRegistered && <NotRegisteredCard tagId={tagId} />}

                {!busy && claimed && <SuccessCard r={claimed} />}

                {!busy && !claimed && v && (
                    <>
                        {v.screen === 'CLAIMABLE' && <ReviewCard v={v} />}
                        {v.screen === 'ALREADY_CLAIMED_BY_YOU' && <OwnedCard v={v} mine />}
                        {v.screen === 'ALREADY_CLAIMED' && <OwnedCard v={v} />}
                    </>
                )}

                {!busy && !claimed && validate.isError && !notRegistered && (
                    <ErrorCard
                        code={code ?? 'ERROR'}
                        message={(validate.error as Error)?.message ?? 'Could not reach the server.'}
                    />
                )}

                {!busy && confirm.isError && (
                    <ErrorCard
                        code={errorCodeOf(confirm.error) ?? 'ERROR'}
                        message={(confirm.error as Error)?.message ?? 'Claim failed.'}
                    />
                )}

                {/* Blockchain ledger — whenever we have a verified product */}
                {!busy && !notRegistered && (ledger.data?.length ?? 0) > 0 && (
                    <LedgerCard entries={ledger.data as LedgerEntry[]} />
                )}
            </ScrollView>

            {/* Actions */}
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-5 mb-2">
                {!busy && !claimed && v?.screen === 'CLAIMABLE' && (
                    <TouchableOpacity onPress={() => confirm.mutate()} activeOpacity={0.85}
                        className="bg-primary rounded-xl h-14 flex-row gap-2 items-center justify-center mb-3">
                        <BadgeCheck color="#FFF" size={20} />
                        <Text className="text-white text-base font-bold">Claim Product</Text>
                    </TouchableOpacity>
                )}

                {!busy && validate.isError && !notRegistered && (
                    <TouchableOpacity onPress={() => void validate.refetch()} activeOpacity={0.85}
                        className="bg-primary rounded-xl h-14 flex-row gap-2 items-center justify-center mb-3">
                        <RefreshCw color="#FFF" size={18} />
                        <Text className="text-white text-base font-bold">Try again</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85}
                    className="bg-transparent border border-[#2A2A32] rounded-xl h-14 items-center justify-center">
                    <Text className="text-neutral-200 text-base font-bold">Done</Text>
                </TouchableOpacity>
            </MotiView>
        </SafeAreaView>
    );
}

/** Tag carries no product — nothing to verify or claim. */
function NotRegisteredCard({ tagId }: { tagId: string }) {
    return (
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} className="items-center mt-4">
            <View className="bg-[#2A1414] p-5 rounded-full mb-4 border" style={{ borderColor: '#7A1C1C' }}>
                <ShieldAlert color="#FF3B30" size={56} />
            </View>
            <Text className="text-2xl font-black text-white mb-2 text-center">Product is not registered</Text>
            <Text className="text-[15px] text-neutral-300 text-center font-medium leading-5 px-5">
                This NFC tag isn&apos;t linked to any HitBox product, so it can&apos;t be verified or claimed.
            </Text>
            <View className="mt-5 bg-[#0F0F13] border border-[#1F1F24] rounded-xl px-4 py-3">
                <Text className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">Scanned tag</Text>
                <Text className="text-neutral-200 text-sm font-bold tracking-wide">{tagId}</Text>
            </View>
        </MotiView>
    );
}

function ProductBox({ v }: { v: ValidateResult }) {
    return (
        <View className="w-full bg-[#0F0F13] border border-[#1F1F24] rounded-2xl p-4">
            {v.product.imageUrl ? (
                <Image source={{ uri: v.product.imageUrl }} style={{ width: '100%', height: 180, borderRadius: 14 }} contentFit="cover" transition={200} />
            ) : (
                <View className="w-full h-[180px] rounded-2xl bg-[#15151b] items-center justify-center">
                    <ScanLine color="#3A3A44" size={48} />
                </View>
            )}
            <Text className="text-white text-xl font-black mt-4">{v.product.name}</Text>
            <Text className="text-neutral-500 text-xs font-medium mt-0.5">Code {v.product.productCode}</Text>
            <View className="flex-row items-center justify-between mt-3">
                <Text className="text-primary text-2xl font-black">${v.product.priceInDollars}</Text>
                {v.product.rewardPoints > 0 && (
                    <View className="flex-row items-center bg-[#1A1508] border border-[#3A2E0A] rounded-full px-3 py-1.5">
                        <Award color="#F2B807" size={15} />
                        <Text className="text-[#F2B807] font-bold text-xs ml-1.5">+{v.product.rewardPoints} pts</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

function ReviewCard({ v }: { v: ValidateResult }) {
    return (
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400 }}>
            <View className="flex-row items-center mb-4">
                <ShieldCheck color="#28C76F" size={20} />
                <Text className="text-[#28C76F] font-bold text-sm ml-2">Genuine • Unclaimed — ready to claim</Text>
            </View>
            <ProductBox v={v} />
        </MotiView>
    );
}

/** Already claimed — "you already own this item", or names the other owner. */
function OwnedCard({ v, mine = false }: { v: ValidateResult; mine?: boolean }) {
    const color = mine ? '#28C76F' : '#F2B807';
    const ownerName = v.owner?.displayName ?? v.owner?.username ?? v.owner?.id ?? 'another collector';
    return (
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} className="items-center mt-2">
            <View className="p-5 rounded-full mb-4 border" style={{ borderColor: color, backgroundColor: '#12121a' }}>
                {mine ? <CheckCircle2 color={color} size={56} /> : <Info color={color} size={56} />}
            </View>
            <Text className="text-2xl font-black text-white mb-1 text-center px-4">
                {mine ? 'You already own this item' : 'Already claimed'}
            </Text>
            <Text className="text-[15px] text-neutral-300 text-center font-medium leading-5 px-4 mb-4">
                {mine
                    ? `"${v.product.name}" is already in your collection.`
                    : `"${v.product.name}" is already claimed by ${ownerName}.`}
            </Text>

            <View className="w-full bg-[#0F0F13] border border-[#1F1F24] rounded-xl p-4 mb-4">
                <Row label="Owner" value={ownerName + (mine ? ' (you)' : '')} />
                {v.owner?.id ? <Row label="User ID" value={v.owner.id} /> : null}
                {v.claimedAt ? <Row label="Claimed" value={new Date(v.claimedAt).toLocaleString()} /> : null}
            </View>

            <ProductBox v={v} />
        </MotiView>
    );
}

function SuccessCard({ r }: { r: ClaimResult }) {
    return (
        <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 400 }} className="items-center mt-4">
            <View className="bg-[#08301C] p-5 rounded-full mb-4 border" style={{ borderColor: '#1C7A4A' }}>
                <CheckCircle2 color="#28C76F" size={64} />
            </View>
            <Text className="text-2xl font-black text-white mb-1">Product Claimed!</Text>
            <Text className="text-[15px] text-neutral-300 text-center font-medium leading-5 px-4 mb-5">{r.message}</Text>
            <View className="w-full bg-[#0F0F13] border border-[#1F1F24] rounded-xl p-4">
                <Row label="Product" value={r.product.name} />
                <Row label="Owner" value={`${r.owner?.displayName ?? r.owner?.username ?? 'you'} (you)`} />
                {r.owner?.id ? <Row label="User ID" value={r.owner.id} /> : null}
                {r.claim ? <Row label="Claim code" value={r.claim.claimCode} /> : null}
            </View>
        </MotiView>
    );
}

function ErrorCard({ code, message }: { code: string; message: string }) {
    return (
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} className="items-center mt-6">
            <View className="bg-[#2A1414] p-5 rounded-full mb-4 border" style={{ borderColor: '#7A1C1C' }}>
                <AlertTriangle color="#FF3B30" size={56} />
            </View>
            <Text className="text-2xl font-black text-white mb-2">Something went wrong</Text>
            <Text className="text-[15px] text-neutral-300 text-center font-medium leading-5 px-4">{message}</Text>
            <Text className="text-[12px] text-neutral-500 mt-3 uppercase tracking-wider">{code}</Text>
        </MotiView>
    );
}

/** Blockchain ledger: Product Id · Tag # · Owner Id · DateTime · Hash · Claim History. */
function LedgerCard({ entries }: { entries: LedgerEntry[] }) {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 150 }}
            className="mt-5"
        >
            <View className="flex-row items-center mb-3">
                <ShieldCheck color="#208AEF" size={18} />
                <Text className="text-white font-bold text-base ml-2">Blockchain Ledger</Text>
                <Text className="text-neutral-500 text-xs font-medium ml-2">
                    {entries.length} record{entries.length === 1 ? '' : 's'}
                </Text>
            </View>

            {entries.map((e) => {
                const isClaim = e.txType === 'CLAIM';
                const accent = isClaim ? '#28C76F' : e.txType === 'MINT' ? '#208AEF' : '#F2B807';
                return (
                    <View key={`${e.sequenceNo}-${e.hash}`} className="bg-[#0F0F13] border border-[#1F1F24] rounded-xl p-3.5 mb-2.5">
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="rounded-md px-2 py-0.5" style={{ backgroundColor: accent + '22', borderWidth: 1, borderColor: accent }}>
                                <Text className="text-[11px] font-black" style={{ color: accent }}>#{e.sequenceNo} {e.txType}</Text>
                            </View>
                            <Text className="text-[11px] text-neutral-500 font-medium">{new Date(e.dateTime).toLocaleString()}</Text>
                        </View>

                        <LedgerRow label="Product Id" value={e.productId} />
                        <LedgerRow label="Tag #" value={e.tag ?? '—'} />
                        <LedgerRow label="Owner Id" value={e.ownerId} highlight={isClaim} />
                        <LedgerRow label="Hash #" value={`${e.hash.slice(0, 24)}…`} />
                        {e.previousHash ? <LedgerRow label="Prev Hash" value={`${e.previousHash.slice(0, 24)}…`} /> : null}
                        <LedgerRow label="Claim History" value={e.claimHistory ? 'Yes' : 'No'} />
                        <LedgerRow label="P2P Trading" value={e.peerToPeerTrading ? 'Yes' : 'No'} />
                    </View>
                );
            })}
        </MotiView>
    );
}

function LedgerRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
    return (
        <View className="flex-row items-start py-[3px]">
            <Text className="text-[11px] text-neutral-500 font-medium w-24">{label}</Text>
            <Text
                className={`text-[12px] flex-1 text-right ${highlight ? 'text-[#28C76F] font-black' : 'text-neutral-200 font-semibold'}`}
                numberOfLines={1}
            >
                {value}
            </Text>
        </View>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <View className="flex-row items-center py-2">
            <Text className="text-[13px] text-neutral-500 font-medium w-24">{label}</Text>
            <Text className="text-[14px] text-neutral-100 font-semibold flex-1 text-right" numberOfLines={1}>{value}</Text>
        </View>
    );
}
