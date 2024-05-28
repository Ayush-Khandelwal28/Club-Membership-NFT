"use client";

import React, { useState } from 'react';
import { useWriteContract, type BaseError } from 'wagmi';
import { abi, address as contractAddress } from '../../constants';
import '../css/Admin.css';

const AdminPage = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    const [role, setRole] = useState('member');
    const [year, setYear] = useState('2024');
    const [nftUri, setNftUri] = useState('');

    const { data: writeData, isPending: isWriteLoading, isError: isWriteError, writeContract } = useWriteContract();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        if (image) {
            data.set('file', image);
            data.set('name', name);
            data.set('address', userAddress);
            data.set('role', role);
            data.set('year', year);
        }
        console.log('Image is', data.get('file'));
        console.log('data is', data);

        const result = await fetch('/api/submit', {
            method: 'POST',
            body: data,
        });

        if (result.ok) {
            console.log('Success');
            const res = await result.json();
            console.log('Result:', res);
            console.log('Image URI:', res.ImageURI);
            console.log('NFT URI:', res.nftURI);
            setNftUri(res.nftURI);
            mintNFT(res.nftURI);
            console.log('Minting NFT: client side');
        } else {
            console.error('Error submitting form');
        }
    };

    const mintNFT = (URI) => {
        console.log('write')
        console.log('Address for Minting', userAddress);
        console.log('NFT URI:', URI);
        writeContract({
            address: contractAddress,
            abi,
            functionName: 'mintNFT',
            args: [userAddress, URI],
        })
    };

    return (
        <div className="admin-page">
            <h1 className="admin-title">Admin Form</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                <label className="admin-label">
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="admin-input"
                        required
                    />
                </label>
                <label className="admin-label">
                    Image:
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="admin-input"
                        required
                    />
                </label>
                <label className="admin-label">
                    Role:
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="admin-input"
                        required
                    >
                        <option value="Member">Member</option>
                        <option value="VicePresident">Vice President</option>
                        <option value="Mentor">Mentor</option>
                    </select>
                </label>
                <label className="admin-label">
                    Address:
                    <input
                        type="text"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        className="admin-input"
                        required
                    />
                </label>
                <label className="admin-label">
                    Batch:
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="admin-input"
                        required
                    >
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                    </select>
                </label>
                <button type="submit" className="admin-button">Submit</button>
            </form>
        </div>
    );
};

export default AdminPage;
